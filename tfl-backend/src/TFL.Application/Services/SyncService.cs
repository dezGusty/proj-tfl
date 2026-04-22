using System.Diagnostics;
using System.Text.Json;
using TFL.Application.DTOs;
using TFL.Application.Interfaces;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Domain.Enums;

namespace TFL.Application.Services;

public class SyncService(
    IFirestoreClient firestoreClient,
    IPlayerRepository playerRepository,
    IMatchRepository matchRepository,
    IGameEventRepository gameEventRepository,
    IDraftRepository draftRepository,
    ISyncStateRepository syncStateRepository,
    ISyncConflictRepository syncConflictRepository,
    IAppSettingsRepository settingsRepository)
{
    public async Task<Dictionary<string, SyncRunSummaryDto>> SyncAllAsync()
    {
        var results = new Dictionary<string, SyncRunSummaryDto>();
        foreach (var entityType in Enum.GetValues<SyncEntityType>())
        {
            results[entityType.ToString()] = await SyncEntityTypeAsync(entityType);
        }
        return results;
    }

    public async Task<SyncRunSummaryDto> SyncEntityTypeAsync(SyncEntityType entityType)
    {
        var sw = Stopwatch.StartNew();
        var syncState = await syncStateRepository.GetByEntityTypeAsync(entityType.ToString());
        var lastSyncAt = syncState?.LastSyncAt;

        SyncRunSummaryDto summary;
        try
        {
            summary = entityType switch
            {
                SyncEntityType.Players => await SyncPlayersAsync(lastSyncAt),
                SyncEntityType.Matches => await SyncMatchesAsync(lastSyncAt),
                SyncEntityType.GameEvents => await SyncGameEventsAsync(lastSyncAt),
                SyncEntityType.Draft => await SyncDraftAsync(lastSyncAt),
                _ => throw new ArgumentOutOfRangeException()
            };
        }
        catch
        {
            sw.Stop();
            throw;
        }

        sw.Stop();
        summary = summary with { DurationMs = sw.ElapsedMilliseconds };

        await syncStateRepository.SaveAsync(new SyncState
        {
            EntityType = entityType.ToString(),
            LastSyncAt = DateTime.UtcNow,
            LastRunSummary = JsonSerializer.Serialize(summary)
        });

        // Rebuild Firestore index documents after match/game event syncs
        if (entityType is SyncEntityType.Matches or SyncEntityType.GameEvents)
            await RebuildFirestoreIndexDocsAsync();

        return summary;
    }

    private async Task<SyncRunSummaryDto> SyncPlayersAsync(DateTime? lastSyncAt)
    {
        int created = 0, updated = 0, skipped = 0, conflicts = 0, softDeleted = 0;

        var currentDoc = await firestoreClient.GetDocumentAsync("ratings/current");
        var archiveDoc = await firestoreClient.GetDocumentAsync("ratings/archive");

        var firestorePlayers = new Dictionary<string, (IReadOnlyDictionary<string, object?> Fields, DateTimeOffset UpdateTime, bool IsArchived)>();
        if (currentDoc is not null)
            foreach (var kv in currentDoc.Fields)
                if (kv.Value is IReadOnlyDictionary<string, object?> playerFields)
                    firestorePlayers[kv.Key] = (playerFields, currentDoc.UpdateTime, false);
        if (archiveDoc is not null)
            foreach (var kv in archiveDoc.Fields)
                if (kv.Value is IReadOnlyDictionary<string, object?> playerFields)
                    firestorePlayers[kv.Key] = (playerFields, archiveDoc.UpdateTime, true);

        var sqlitePlayers = await playerRepository.GetAllIncludingArchivedAsync();
        var sqliteMap = sqlitePlayers.ToDictionary(p => p.Id.ToString());

        var allKeys = firestorePlayers.Keys.Union(sqliteMap.Keys).ToHashSet();

        foreach (var key in allKeys)
        {
            var inFirestore = firestorePlayers.TryGetValue(key, out var fsData);
            var inSqlite = sqliteMap.TryGetValue(key, out var sqlitePlayer);

            if (inFirestore && !inSqlite)
            {
                // Case 1: Firestore only → create in SQLite
                var player = MapFirestoreToPlayer(fsData.Fields, int.Parse(key), fsData.IsArchived);
                player.LastModified = fsData.UpdateTime.UtcDateTime;
                await playerRepository.CreateAsync(player);
                created++;
            }
            else if (!inFirestore && inSqlite)
            {
                if (lastSyncAt is null || sqlitePlayer!.LastModified > lastSyncAt)
                {
                    // Case 2: SQLite only, new or modified → push to Firestore
                    await WritePlayerToFirestoreAsync(sqlitePlayer!);
                    updated++;
                }
                else
                {
                    // Case 3: Deleted in Firestore → soft-delete in SQLite
                    sqlitePlayer!.IsArchived = true;
                    sqlitePlayer.LastModified = DateTime.UtcNow;
                    await playerRepository.UpdateAsync(sqlitePlayer);
                    softDeleted++;
                }
            }
            else if (inFirestore && inSqlite)
            {
                var fsModified = fsData.UpdateTime.UtcDateTime;
                var sqlModified = sqlitePlayer!.LastModified;

                var fsChanged = lastSyncAt is null || fsModified > lastSyncAt;
                var sqlChanged = lastSyncAt is null || sqlModified > lastSyncAt;

                if (!fsChanged && !sqlChanged) { skipped++; }
                else if (fsChanged && !sqlChanged)
                {
                    // Case 5: Firestore newer → update SQLite
                    UpdatePlayerFromFirestore(sqlitePlayer, fsData.Fields, fsData.IsArchived);
                    sqlitePlayer.LastModified = fsModified;
                    await playerRepository.UpdateAsync(sqlitePlayer);
                    updated++;
                }
                else if (!fsChanged && sqlChanged)
                {
                    // Case 6: SQLite newer → update Firestore
                    await WritePlayerToFirestoreAsync(sqlitePlayer);
                    updated++;
                }
                else
                {
                    // Case 7: Both changed → conflict
                    await syncConflictRepository.CreateOrUpdateAsync(new SyncConflict
                    {
                        EntityType = "Player",
                        EntityKey = key,
                        SqliteSnapshot = JsonSerializer.Serialize(sqlitePlayer),
                        FirestoreSnapshot = JsonSerializer.Serialize(fsData.Fields),
                        DetectedAt = DateTime.UtcNow
                    });
                    conflicts++;
                }
            }
        }

        return new SyncRunSummaryDto(created, updated, skipped, conflicts, softDeleted, 0);
    }

    private async Task<SyncRunSummaryDto> SyncMatchesAsync(DateTime? lastSyncAt)
    {
        int created = 0, updated = 0, skipped = 0, conflicts = 0, softDeleted = 0;

        var fsDocs = await firestoreClient.GetCollectionAsync("matches");
        var fsMap = fsDocs
            .Where(d => !d.DocumentPath.EndsWith("/recent"))
            .ToDictionary(d => d.DocumentPath.Split('/').Last());

        var sqliteMatches = await matchRepository.GetAllAsync();
        var sqliteMap = sqliteMatches.ToDictionary(m => m.DateKey);

        var allKeys = fsMap.Keys.Union(sqliteMap.Keys).ToHashSet();

        foreach (var key in allKeys)
        {
            var inFirestore = fsMap.TryGetValue(key, out var fsDoc);
            var inSqlite = sqliteMap.TryGetValue(key, out var sqliteMatch);

            if (inFirestore && !inSqlite)
            {
                var match = MapFirestoreToMatch(fsDoc!);
                await matchRepository.CreateAsync(match);
                created++;
            }
            else if (!inFirestore && inSqlite)
            {
                if (lastSyncAt is null || sqliteMatch!.LastModified > lastSyncAt)
                {
                    await WriteMatchToFirestoreAsync(sqliteMatch!);
                    updated++;
                }
                else
                {
                    sqliteMatch!.Status = MatchStatus.NotPlayed;
                    sqliteMatch.LastModified = DateTime.UtcNow;
                    await matchRepository.UpdateAsync(sqliteMatch);
                    softDeleted++;
                }
            }
            else if (inFirestore && inSqlite)
            {
                var fsModified = fsDoc!.UpdateTime.UtcDateTime;
                var sqlModified = sqliteMatch!.LastModified;
                var fsChanged = lastSyncAt is null || fsModified > lastSyncAt;
                var sqlChanged = lastSyncAt is null || sqlModified > lastSyncAt;

                if (!fsChanged && !sqlChanged) { skipped++; }
                else if (fsChanged && !sqlChanged)
                {
                    UpdateMatchFromFirestore(sqliteMatch, fsDoc);
                    await matchRepository.UpdateAsync(sqliteMatch);
                    updated++;
                }
                else if (!fsChanged && sqlChanged)
                {
                    await WriteMatchToFirestoreAsync(sqliteMatch);
                    updated++;
                }
                else
                {
                    await syncConflictRepository.CreateOrUpdateAsync(new SyncConflict
                    {
                        EntityType = "Match",
                        EntityKey = key,
                        SqliteSnapshot = JsonSerializer.Serialize(sqliteMatch),
                        FirestoreSnapshot = JsonSerializer.Serialize(fsDoc.Fields),
                        DetectedAt = DateTime.UtcNow
                    });
                    conflicts++;
                }
            }
        }

        return new SyncRunSummaryDto(created, updated, skipped, conflicts, softDeleted, 0);
    }

    private async Task<SyncRunSummaryDto> SyncGameEventsAsync(DateTime? lastSyncAt)
    {
        int created = 0, updated = 0, skipped = 0, conflicts = 0, softDeleted = 0;

        var fsDocs = await firestoreClient.GetCollectionAsync("games");
        var fsMap = fsDocs
            .Where(d => !d.DocumentPath.EndsWith("/_list"))
            .ToDictionary(d => d.DocumentPath.Split('/').Last());

        var sqliteEvents = await gameEventRepository.GetAllAsync();
        var sqliteMap = sqliteEvents.ToDictionary(e => e.Name);

        var allKeys = fsMap.Keys.Union(sqliteMap.Keys).ToHashSet();

        foreach (var key in allKeys)
        {
            var inFirestore = fsMap.TryGetValue(key, out var fsDoc);
            var inSqlite = sqliteMap.TryGetValue(key, out var sqliteEvent);

            if (inFirestore && !inSqlite)
            {
                var evt = MapFirestoreToGameEvent(key, fsDoc!);
                await gameEventRepository.CreateAsync(evt);
                created++;
            }
            else if (!inFirestore && inSqlite)
            {
                if (lastSyncAt is null || sqliteEvent!.LastModified > lastSyncAt)
                {
                    await WriteGameEventToFirestoreAsync(sqliteEvent!);
                    updated++;
                }
                else
                {
                    sqliteEvent!.Inactive = true;
                    sqliteEvent.LastModified = DateTime.UtcNow;
                    await gameEventRepository.UpdateAsync(sqliteEvent);
                    softDeleted++;
                }
            }
            else if (inFirestore && inSqlite)
            {
                var fsModified = fsDoc!.UpdateTime.UtcDateTime;
                var sqlModified = sqliteEvent!.LastModified;
                var fsChanged = lastSyncAt is null || fsModified > lastSyncAt;
                var sqlChanged = lastSyncAt is null || sqlModified > lastSyncAt;

                if (!fsChanged && !sqlChanged) { skipped++; }
                else if (fsChanged && !sqlChanged)
                {
                    UpdateGameEventFromFirestore(sqliteEvent, fsDoc);
                    await gameEventRepository.UpdateAsync(sqliteEvent);
                    updated++;
                }
                else if (!fsChanged && sqlChanged)
                {
                    await WriteGameEventToFirestoreAsync(sqliteEvent);
                    updated++;
                }
                else
                {
                    await syncConflictRepository.CreateOrUpdateAsync(new SyncConflict
                    {
                        EntityType = "GameEvent",
                        EntityKey = key,
                        SqliteSnapshot = JsonSerializer.Serialize(sqliteEvent),
                        FirestoreSnapshot = JsonSerializer.Serialize(fsDoc.Fields),
                        DetectedAt = DateTime.UtcNow
                    });
                    conflicts++;
                }
            }
        }

        return new SyncRunSummaryDto(created, updated, skipped, conflicts, softDeleted, 0);
    }

    private async Task<SyncRunSummaryDto> SyncDraftAsync(DateTime? lastSyncAt)
    {
        int created = 0, updated = 0, skipped = 0, conflicts = 0, softDeleted = 0;

        var fsDoc = await firestoreClient.GetDocumentAsync("drafts/next");
        var draft = await draftRepository.GetAsync();

        if (fsDoc is null)
        {
            if (lastSyncAt is null || draft.LastModified > lastSyncAt)
            {
                await WriteDraftToFirestoreAsync(draft);
                updated++;
            }
            else
            {
                skipped++;
            }
        }
        else
        {
            var fsModified = fsDoc.UpdateTime.UtcDateTime;
            var sqlModified = draft.LastModified;
            var fsChanged = lastSyncAt is null || fsModified > lastSyncAt;
            var sqlChanged = lastSyncAt is null || sqlModified > lastSyncAt;

            if (!fsChanged && !sqlChanged) { skipped++; }
            else if (fsChanged && !sqlChanged)
            {
                draft = MapFirestoreToDraft(fsDoc);
                await draftRepository.SaveAsync(draft);
                updated++;
            }
            else if (!fsChanged && sqlChanged)
            {
                await WriteDraftToFirestoreAsync(draft);
                updated++;
            }
            else
            {
                await syncConflictRepository.CreateOrUpdateAsync(new SyncConflict
                {
                    EntityType = "Draft",
                    EntityKey = "next",
                    SqliteSnapshot = JsonSerializer.Serialize(draft),
                    FirestoreSnapshot = JsonSerializer.Serialize(fsDoc.Fields),
                    DetectedAt = DateTime.UtcNow
                });
                conflicts++;
            }
        }

        return new SyncRunSummaryDto(created, updated, skipped, conflicts, softDeleted, 0);
    }

    private async Task RebuildFirestoreIndexDocsAsync()
    {
        var settings = await settingsRepository.GetAsync();

        // Rebuild matches/recent
        var recentMatches = await matchRepository.GetRecentAsync(settings.RecentMatchesToStore);
        var recentData = recentMatches.ToDictionary(
            m => m.DateKey,
            m => (object)m.Status.ToString().ToLowerInvariant());
        await firestoreClient.SetDocumentAsync("matches/recent", recentData);

        // Rebuild games/_list
        var activeEvents = await gameEventRepository.GetAllActiveAsync();
        var gamesList = new { games = activeEvents.Select(e => e.Name).ToArray() };
        await firestoreClient.SetDocumentAsync("games/_list", gamesList);
    }

    public async Task<SyncStatusDto> GetStatusAsync()
    {
        var states = await syncStateRepository.GetAllAsync();
        var conflictCount = await syncConflictRepository.GetCountAsync();

        var lastSyncAt = new Dictionary<string, DateTime?>();
        var summaries = new Dictionary<string, SyncRunSummaryDto?>();

        foreach (var entityType in Enum.GetValues<SyncEntityType>())
        {
            var name = entityType.ToString();
            var state = states.FirstOrDefault(s => s.EntityType == name);
            lastSyncAt[name] = state?.LastSyncAt;

            SyncRunSummaryDto? summary = null;
            if (state?.LastRunSummary is not null)
            {
                try { summary = JsonSerializer.Deserialize<SyncRunSummaryDto>(state.LastRunSummary); }
                catch { }
            }
            summaries[name] = summary;
        }

        return new SyncStatusDto(lastSyncAt, conflictCount, summaries);
    }

    public async Task<List<SyncConflictDto>> GetConflictsAsync()
    {
        var conflicts = await syncConflictRepository.GetAllAsync();
        return conflicts.Select(c => new SyncConflictDto(
            c.Id,
            c.EntityType,
            c.EntityKey,
            JsonSerializer.Deserialize<object>(c.SqliteSnapshot)!,
            JsonSerializer.Deserialize<object>(c.FirestoreSnapshot)!,
            c.DetectedAt)).ToList();
    }

    public async Task<bool> ResolveConflictAsync(int id, string winner)
    {
        var conflict = await syncConflictRepository.GetByIdAsync(id);
        if (conflict is null) return false;

        if (winner == "sqlite")
        {
            var sqliteData = JsonSerializer.Deserialize<object>(conflict.SqliteSnapshot);
            if (sqliteData is not null)
                await firestoreClient.SetDocumentAsync(
                    $"{EntityTypeToPath(conflict.EntityType)}/{conflict.EntityKey}", sqliteData);
        }
        else if (winner == "firestore")
        {
            // For firestore wins, we just mark it resolved — the next sync will apply the Firestore data
            // In a full implementation we'd apply it directly to SQLite here
        }

        await syncConflictRepository.DeleteAsync(id);
        return true;
    }

    private static string EntityTypeToPath(string entityType) => entityType switch
    {
        "Player" => "ratings",
        "Match" => "matches",
        "GameEvent" => "games",
        "Draft" => "drafts",
        _ => entityType.ToLowerInvariant()
    };

    // Mapping helpers
    private static Player MapFirestoreToPlayer(IReadOnlyDictionary<string, object?> fields, int id, bool isArchived)
    {
        return new Player
        {
            Id = id,
            Name = fields.TryGetValue("name", out var n) ? n?.ToString() ?? "" : "",
            DisplayName = fields.TryGetValue("displayName", out var dn) ? dn?.ToString() : null,
            Rating = fields.TryGetValue("rating", out var r) && double.TryParse(r?.ToString(), out var rd) ? rd : 5.0,
            Keywords = fields.TryGetValue("keywords", out var k) ? k?.ToString() : null,
            Affinity = fields.TryGetValue("affinity", out var a) && int.TryParse(a?.ToString(), out var ai) ? ai : 0,
            IsArchived = isArchived,
            LastModified = DateTime.UtcNow
        };
    }

    private static void UpdatePlayerFromFirestore(Player player, IReadOnlyDictionary<string, object?> fields, bool isArchived)
    {
        player.Name = fields.TryGetValue("name", out var n) ? n?.ToString() ?? player.Name : player.Name;
        player.DisplayName = fields.TryGetValue("displayName", out var dn) ? dn?.ToString() : player.DisplayName;
        player.Rating = fields.TryGetValue("rating", out var r) && double.TryParse(r?.ToString(), out var rd) ? rd : player.Rating;
        player.IsArchived = isArchived;
    }

    private async Task WritePlayerToFirestoreAsync(Player player)
    {
        var docPath = player.IsArchived ? "ratings/archive" : "ratings/current";
        var doc = await firestoreClient.GetDocumentAsync(docPath) ?? new FirestoreDocumentSnapshot(docPath, new Dictionary<string, object?>(), DateTimeOffset.MinValue);
        var fields = new Dictionary<string, object?>(doc.Fields)
        {
            [player.Id.ToString()] = new Dictionary<string, object?>
            {
                ["name"] = player.Name,
                ["displayName"] = player.DisplayName,
                ["rating"] = player.Rating,
                ["keywords"] = player.Keywords,
                ["affinity"] = player.Affinity
            }
        };
        await firestoreClient.SetDocumentAsync(docPath, fields);
    }

    private static Match MapFirestoreToMatch(FirestoreDocumentSnapshot doc)
    {
        var fields = doc.Fields;
        var dateKey = doc.DocumentPath.Split('/').Last();
        var match = new Match
        {
            DateKey = dateKey,
            ScoreTeam1 = fields.TryGetValue("scoreTeam1", out var s1) && int.TryParse(s1?.ToString(), out var si1) ? si1 : 0,
            ScoreTeam2 = fields.TryGetValue("scoreTeam2", out var s2) && int.TryParse(s2?.ToString(), out var si2) ? si2 : 0,
            SavedResult = true,
            LastModified = doc.UpdateTime.UtcDateTime
        };
        return match;
    }

    private static void UpdateMatchFromFirestore(Match match, FirestoreDocumentSnapshot doc)
    {
        var fields = doc.Fields;
        match.ScoreTeam1 = fields.TryGetValue("scoreTeam1", out var s1) && int.TryParse(s1?.ToString(), out var si1) ? si1 : match.ScoreTeam1;
        match.ScoreTeam2 = fields.TryGetValue("scoreTeam2", out var s2) && int.TryParse(s2?.ToString(), out var si2) ? si2 : match.ScoreTeam2;
        match.LastModified = doc.UpdateTime.UtcDateTime;
    }

    private async Task WriteMatchToFirestoreAsync(Match match)
    {
        var data = new Dictionary<string, object?>
        {
            ["scoreTeam1"] = match.ScoreTeam1,
            ["scoreTeam2"] = match.ScoreTeam2,
            ["status"] = match.Status.ToString().ToLowerInvariant(),
            ["team1"] = match.MatchPlayers.Where(mp => mp.Team == 1).Select(mp => mp.PlayerId).ToArray(),
            ["team2"] = match.MatchPlayers.Where(mp => mp.Team == 2).Select(mp => mp.PlayerId).ToArray()
        };
        await firestoreClient.SetDocumentAsync($"matches/{match.DateKey}", data);
    }

    private static GameEvent MapFirestoreToGameEvent(string name, FirestoreDocumentSnapshot doc)
    {
        var fields = doc.Fields;
        return new GameEvent
        {
            Name = name,
            MatchDate = fields.TryGetValue("matchDate", out var md) ? md?.ToString() ?? "" : "",
            Inactive = fields.TryGetValue("inactive", out var inact) && bool.TryParse(inact?.ToString(), out var b) && b,
            LastModified = doc.UpdateTime.UtcDateTime
        };
    }

    private static void UpdateGameEventFromFirestore(GameEvent evt, FirestoreDocumentSnapshot doc)
    {
        var fields = doc.Fields;
        evt.Inactive = fields.TryGetValue("inactive", out var inact) && bool.TryParse(inact?.ToString(), out var b) && b;
        evt.LastModified = doc.UpdateTime.UtcDateTime;
    }

    private async Task WriteGameEventToFirestoreAsync(GameEvent evt)
    {
        var data = new Dictionary<string, object?>
        {
            ["matchDate"] = evt.MatchDate,
            ["inactive"] = evt.Inactive,
            ["registeredPlayerIds"] = evt.Registrations.OrderBy(r => r.SortOrder).Select(r => r.PlayerId).ToArray()
        };
        await firestoreClient.SetDocumentAsync($"games/{evt.Name}", data);
    }

    private static Draft MapFirestoreToDraft(FirestoreDocumentSnapshot doc)
    {
        var playerIds = new List<int>();
        if (doc.Fields.TryGetValue("players", out var players) && players is IEnumerable<object?> playerList)
        {
            foreach (var p in playerList)
                if (int.TryParse(p?.ToString(), out var id))
                    playerIds.Add(id);
        }

        return new Draft
        {
            Id = 1,
            LastModified = doc.UpdateTime.UtcDateTime,
            DraftPlayers = playerIds
                .Select((id, i) => new DraftPlayer { PlayerId = id, SortOrder = i, DraftId = 1 })
                .ToList()
        };
    }

    private async Task WriteDraftToFirestoreAsync(Draft draft)
    {
        var data = new Dictionary<string, object?>
        {
            ["players"] = draft.DraftPlayers.OrderBy(dp => dp.SortOrder).Select(dp => dp.PlayerId).ToArray()
        };
        await firestoreClient.SetDocumentAsync("drafts/next", data);
    }
}
