using System.Text.Json;
using TFL.Application.DTOs;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Domain.Enums;

namespace TFL.Application.Services;

public class GameEventService(
    IGameEventRepository gameEventRepository,
    IPlayerRepository playerRepository,
    IDraftRepository draftRepository)
{
    public async Task<List<GameEventSummaryDto>> GetAllActiveAsync()
    {
        var events = await gameEventRepository.GetAllActiveAsync();
        return events.Select(MapToSummaryDto).ToList();
    }

    public async Task<GameEventDetailDto?> GetByNameAsync(string name)
    {
        var evt = await gameEventRepository.GetByNameAsync(name);
        return evt is null ? null : MapToDetailDto(evt);
    }

    public async Task<GameEventDetailDto> CreateAsync(CreateGameEventRequest request)
    {
        var baseName = string.IsNullOrEmpty(request.TimeSuffix)
            ? request.MatchDate
            : $"{request.MatchDate}_{request.TimeSuffix}";

        // Resolve name conflicts
        var name = baseName;
        var existing = await gameEventRepository.GetByNameAsync(name);
        if (existing is not null)
        {
            var allEvents = await gameEventRepository.GetAllAsync();
            var suffixNum = 2;
            while (allEvents.Any(e => e.Name == $"{baseName}_{suffixNum}"))
                suffixNum++;
            name = $"{baseName}_{suffixNum}";
        }

        var gameEvent = new GameEvent
        {
            Name = name,
            MatchDate = request.MatchDate,
            LastModified = DateTime.UtcNow
        };

        var created = await gameEventRepository.CreateAsync(gameEvent);
        return MapToDetailDto(created);
    }

    public async Task<GameEventDetailDto?> UpdateAsync(string name, UpdateGameEventRequest request)
    {
        var evt = await gameEventRepository.GetByNameAsync(name);
        if (evt is null) return null;

        evt.Inactive = request.Inactive;
        evt.MatchStatus = ParseStatus(request.MatchStatus);
        evt.LastModified = DateTime.UtcNow;

        evt.Registrations.Clear();
        foreach (var reg in request.Registrations)
        {
            evt.Registrations.Add(new GameEventRegistration
            {
                GameEventName = name,
                PlayerId = reg.PlayerId,
                IsReserve = reg.IsReserve,
                Stars = reg.Stars,
                SortOrder = reg.SortOrder
            });
        }

        var updated = await gameEventRepository.UpdateAsync(evt);
        return MapToDetailDto(updated);
    }

    public async Task<bool> JoinAsync(string name, int playerId)
    {
        var evt = await gameEventRepository.GetByNameAsync(name);
        if (evt is null || evt.Inactive) return false;

        if (evt.Registrations.Any(r => r.PlayerId == playerId)) return false;

        var maxOrder = evt.Registrations.Any() ? evt.Registrations.Max(r => r.SortOrder) : -1;
        evt.Registrations.Add(new GameEventRegistration
        {
            GameEventName = name,
            PlayerId = playerId,
            SortOrder = maxOrder + 1
        });
        evt.LastModified = DateTime.UtcNow;

        await gameEventRepository.UpdateAsync(evt);
        return true;
    }

    public async Task<bool> LeaveAsync(string name, int playerId)
    {
        var evt = await gameEventRepository.GetByNameAsync(name);
        if (evt is null) return false;

        var reg = evt.Registrations.FirstOrDefault(r => r.PlayerId == playerId);
        if (reg is null) return false;

        evt.Registrations.Remove(reg);
        evt.LastModified = DateTime.UtcNow;

        await gameEventRepository.UpdateAsync(evt);
        return true;
    }

    public async Task<DraftDto> TransferToDraftAsync(string name)
    {
        var evt = await gameEventRepository.GetByNameAsync(name);
        if (evt is null) throw new InvalidOperationException($"Game event '{name}' not found.");

        var orderedIds = evt.Registrations
            .OrderBy(r => r.SortOrder)
            .Select(r => r.PlayerId)
            .ToList();

        var draft = new Draft
        {
            Id = 1,
            LastModified = DateTime.UtcNow,
            DraftPlayers = orderedIds
                .Select((id, i) => new DraftPlayer { PlayerId = id, SortOrder = i, DraftId = 1 })
                .ToList()
        };

        var saved = await draftRepository.SaveAsync(draft);
        return new DraftDto(
            saved.DraftPlayers.OrderBy(dp => dp.SortOrder).Select(dp => dp.PlayerId).ToList(),
            saved.LastModified);
    }

    public async Task<GameEventSummaryMatrixDto> GetSummaryAsync()
    {
        var events = await gameEventRepository.GetAllActiveAsync();
        var allPlayers = await playerRepository.GetAllActiveAsync();

        var eventNames = events
            .OrderByDescending(e => e.MatchDate)
            .Select(e => e.Name)
            .ToList();

        var registrationMap = events
            .SelectMany(e => e.Registrations.Select(r => (EventName: e.Name, Reg: r)))
            .ToDictionary(x => (x.EventName, x.Reg.PlayerId), x => x.Reg);

        var playerRegistrationCount = allPlayers
            .Select(p => (Player: p, Count: eventNames.Count(en =>
                registrationMap.ContainsKey((en, p.Id)))))
            .Where(x => x.Count > 0)
            .OrderByDescending(x => x.Count)
            .ToList();

        var rows = playerRegistrationCount.Select(x =>
        {
            var playerRegs = new Dictionary<string, EventRegistrationStatusDto>();
            foreach (var en in eventNames)
            {
                if (registrationMap.TryGetValue((en, x.Player.Id), out var reg))
                    playerRegs[en] = new EventRegistrationStatusDto(true, reg.IsReserve, reg.Stars);
                else
                    playerRegs[en] = new EventRegistrationStatusDto(false, false, 0);
            }
            return new PlayerEventRowDto(x.Player.Id, x.Player.Name, x.Player.DisplayName, playerRegs);
        }).ToList();

        return new GameEventSummaryMatrixDto(eventNames, rows);
    }

    private static GameEventSummaryDto MapToSummaryDto(GameEvent e) => new(
        e.Name,
        e.MatchDate,
        e.Registrations.Count,
        e.Inactive,
        e.MatchStatus.ToString().ToLowerInvariant());

    private static GameEventDetailDto MapToDetailDto(GameEvent e) => new(
        e.Name,
        e.MatchDate,
        e.Registrations
            .OrderBy(r => r.SortOrder)
            .Select(r => new RegistrationDto(r.PlayerId, r.IsReserve, r.Stars, r.SortOrder))
            .ToList(),
        e.Inactive,
        e.MatchStatus.ToString().ToLowerInvariant(),
        e.LastModified);

    private static MatchStatus ParseStatus(string status) =>
        status.ToLowerInvariant() switch
        {
            "valid" => MatchStatus.Valid,
            "unbalanced" => MatchStatus.Unbalanced,
            "not_played" => MatchStatus.NotPlayed,
            _ => MatchStatus.Unknown
        };
}
