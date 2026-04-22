using Moq;
using TFL.Application.Interfaces;
using TFL.Application.Interfaces.Repositories;
using TFL.Application.Services;
using TFL.Domain.Entities;
using TFL.Domain.Enums;

namespace TFL.Tests.Unit.Services;

public class SyncServiceTests
{
    private static SyncService BuildService(
        Mock<IFirestoreClient>? firestore = null,
        Mock<IPlayerRepository>? playerRepo = null,
        Mock<IMatchRepository>? matchRepo = null,
        Mock<IGameEventRepository>? gameEventRepo = null,
        Mock<IDraftRepository>? draftRepo = null,
        Mock<ISyncStateRepository>? syncState = null,
        Mock<ISyncConflictRepository>? conflictRepo = null,
        Mock<IAppSettingsRepository>? settingsRepo = null)
    {
        var isNewConflictRepo = conflictRepo is null;
        firestore ??= new Mock<IFirestoreClient>();
        playerRepo ??= new Mock<IPlayerRepository>();
        matchRepo ??= new Mock<IMatchRepository>();
        gameEventRepo ??= new Mock<IGameEventRepository>();
        draftRepo ??= new Mock<IDraftRepository>();
        syncState ??= new Mock<ISyncStateRepository>();
        conflictRepo ??= new Mock<ISyncConflictRepository>();
        settingsRepo ??= new Mock<IAppSettingsRepository>();

        // Default setups
        firestore.Setup(f => f.GetDocumentAsync(It.IsAny<string>())).ReturnsAsync((FirestoreDocumentSnapshot?)null);
        firestore.Setup(f => f.GetCollectionAsync(It.IsAny<string>())).ReturnsAsync([]);
        firestore.Setup(f => f.SetDocumentAsync(It.IsAny<string>(), It.IsAny<object>())).Returns(Task.CompletedTask);
        playerRepo.Setup(r => r.GetAllIncludingArchivedAsync()).ReturnsAsync([]);
        matchRepo.Setup(r => r.GetAllAsync()).ReturnsAsync([]);
        matchRepo.Setup(r => r.GetRecentAsync(It.IsAny<int>())).ReturnsAsync([]);
        gameEventRepo.Setup(r => r.GetAllAsync()).ReturnsAsync([]);
        gameEventRepo.Setup(r => r.GetAllActiveAsync()).ReturnsAsync([]);
        draftRepo.Setup(r => r.GetAsync()).ReturnsAsync(new Draft { Id = 1 });
        draftRepo.Setup(r => r.SaveAsync(It.IsAny<Draft>())).ReturnsAsync(new Draft { Id = 1 });
        syncState.Setup(r => r.GetAllAsync()).ReturnsAsync([]);
        syncState.Setup(r => r.GetByEntityTypeAsync(It.IsAny<string>())).ReturnsAsync((SyncState?)null);
        syncState.Setup(r => r.SaveAsync(It.IsAny<SyncState>())).ReturnsAsync(new SyncState());
        if (isNewConflictRepo)
        {
            conflictRepo.Setup(r => r.GetAllAsync()).ReturnsAsync([]);
            conflictRepo.Setup(r => r.GetCountAsync()).ReturnsAsync(0);
        }
        else
        {
            // Ensure GetCountAsync has a default if not explicitly set
            conflictRepo.Setup(r => r.GetCountAsync()).Returns(() => Task.FromResult(0)).Verifiable(Times.Never());
        }
        settingsRepo.Setup(r => r.GetAsync()).ReturnsAsync(new AppSettings { Id = 1, RecentMatchesToStore = 6 });

        return new SyncService(
            firestore.Object,
            playerRepo.Object,
            matchRepo.Object,
            gameEventRepo.Object,
            draftRepo.Object,
            syncState.Object,
            conflictRepo.Object,
            settingsRepo.Object);
    }

    [Fact]
    public async Task SyncAllAsync_ReturnsAllEntityTypeKeys()
    {
        var svc = BuildService();
        var result = await svc.SyncAllAsync();

        Assert.True(result.ContainsKey("Players"));
        Assert.True(result.ContainsKey("Matches"));
        Assert.True(result.ContainsKey("GameEvents"));
        Assert.True(result.ContainsKey("Draft"));
    }

    [Fact]
    public async Task SyncEntityTypeAsync_Players_SavesSyncState()
    {
        var syncState = new Mock<ISyncStateRepository>();
        syncState.Setup(r => r.GetByEntityTypeAsync("Players")).ReturnsAsync((SyncState?)null);
        syncState.Setup(r => r.SaveAsync(It.IsAny<SyncState>())).ReturnsAsync(new SyncState());

        var firestore = new Mock<IFirestoreClient>();
        firestore.Setup(f => f.GetDocumentAsync("ratings/current")).ReturnsAsync((FirestoreDocumentSnapshot?)null);
        firestore.Setup(f => f.GetDocumentAsync("ratings/archive")).ReturnsAsync((FirestoreDocumentSnapshot?)null);
        firestore.Setup(f => f.GetCollectionAsync(It.IsAny<string>())).ReturnsAsync([]);
        firestore.Setup(f => f.SetDocumentAsync(It.IsAny<string>(), It.IsAny<object>())).Returns(Task.CompletedTask);

        var playerRepo = new Mock<IPlayerRepository>();
        playerRepo.Setup(r => r.GetAllIncludingArchivedAsync()).ReturnsAsync([]);

        var svc = BuildService(firestore: firestore, playerRepo: playerRepo, syncState: syncState);
        await svc.SyncEntityTypeAsync(SyncEntityType.Players);

        syncState.Verify(r => r.SaveAsync(It.Is<SyncState>(s => s.EntityType == "Players")), Times.Once);
    }

    [Fact]
    public async Task SyncEntityTypeAsync_SummaryHasDurationMs()
    {
        var svc = BuildService();
        var summary = await svc.SyncEntityTypeAsync(SyncEntityType.Draft);

        Assert.True(summary.DurationMs >= 0);
    }

    [Fact]
    public async Task GetStatusAsync_ReturnsSyncStatusWithAllEntityTypes()
    {
        var syncState = new Mock<ISyncStateRepository>();
        syncState.Setup(r => r.GetAllAsync()).ReturnsAsync([
            new SyncState { EntityType = "Players", LastSyncAt = DateTime.UtcNow },
            new SyncState { EntityType = "Matches", LastSyncAt = DateTime.UtcNow }
        ]);
        syncState.Setup(r => r.GetByEntityTypeAsync(It.IsAny<string>())).ReturnsAsync((SyncState?)null);

        var svc = BuildService(syncState: syncState);
        var status = await svc.GetStatusAsync();

        Assert.NotNull(status);
        Assert.True(status.LastSyncAt.ContainsKey("Players"));
        Assert.True(status.LastSyncAt.ContainsKey("Matches"));
    }

    [Fact]
    public async Task GetConflictsAsync_ReturnsConflictsFromRepository()
    {
        var conflictRepo = new Mock<ISyncConflictRepository>();
        conflictRepo.Setup(r => r.GetAllAsync()).ReturnsAsync([
            new SyncConflict
            {
                Id = 1,
                EntityType = "Players",
                EntityKey = "42",
                SqliteSnapshot = "{}",
                FirestoreSnapshot = "{}",
                DetectedAt = DateTime.UtcNow
            }
        ]);
        conflictRepo.Setup(r => r.GetCountAsync()).ReturnsAsync(1);

        var svc = BuildService(conflictRepo: conflictRepo);
        var conflicts = await svc.GetConflictsAsync();

        Assert.Single(conflicts);
        Assert.Equal("Players", conflicts[0].EntityType);
    }

    [Fact]
    public async Task ResolveConflictAsync_NonExistentId_ReturnsFalse()
    {
        var conflictRepo = new Mock<ISyncConflictRepository>();
        conflictRepo.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((SyncConflict?)null);

        var svc = BuildService(conflictRepo: conflictRepo);
        var result = await svc.ResolveConflictAsync(999, "sqlite");

        Assert.False(result);
    }

    [Fact]
    public async Task SyncEntityTypeAsync_NullLastSyncAt_BootstrapMode()
    {
        var syncState = new Mock<ISyncStateRepository>();
        syncState.Setup(r => r.GetByEntityTypeAsync("Draft")).ReturnsAsync((SyncState?)null);
        syncState.Setup(r => r.SaveAsync(It.IsAny<SyncState>())).ReturnsAsync(new SyncState());

        var svc = BuildService(syncState: syncState);

        // Should not throw — bootstrap mode creates from empty Firestore
        var summary = await svc.SyncEntityTypeAsync(SyncEntityType.Draft);
        Assert.NotNull(summary);
    }

    [Fact]
    public async Task SyncAllAsync_AllSummariesHaveNonNegativeDuration()
    {
        var svc = BuildService();
        var results = await svc.SyncAllAsync();

        Assert.All(results.Values, s => Assert.True(s.DurationMs >= 0));
    }

    [Fact]
    public async Task SyncEntityTypeAsync_Matches_RebuildFirestoreIndexDocs()
    {
        var firestore = new Mock<IFirestoreClient>();
        firestore.Setup(f => f.GetCollectionAsync(It.IsAny<string>())).ReturnsAsync([]);
        firestore.Setup(f => f.SetDocumentAsync(It.IsAny<string>(), It.IsAny<object>())).Returns(Task.CompletedTask);
        firestore.Setup(f => f.GetDocumentAsync(It.IsAny<string>())).ReturnsAsync((FirestoreDocumentSnapshot?)null);

        var syncState = new Mock<ISyncStateRepository>();
        syncState.Setup(r => r.GetByEntityTypeAsync("Matches")).ReturnsAsync((SyncState?)null);
        syncState.Setup(r => r.SaveAsync(It.IsAny<SyncState>())).ReturnsAsync(new SyncState());
        syncState.Setup(r => r.GetByEntityTypeAsync("GameEvents")).ReturnsAsync((SyncState?)null);

        var svc = BuildService(firestore: firestore, syncState: syncState);
        await svc.SyncEntityTypeAsync(SyncEntityType.Matches);

        // Firestore index rebuild: "matches/recent" should be written
        firestore.Verify(f => f.SetDocumentAsync(
            It.Is<string>(s => s.StartsWith("matches/")),
            It.IsAny<object>()), Times.AtLeastOnce);
    }

    [Fact]
    public async Task SyncEntityTypeAsync_SummaryCreatedUpdatedCounts_AreNonNegative()
    {
        var svc = BuildService();
        var summary = await svc.SyncEntityTypeAsync(SyncEntityType.Players);

        Assert.True(summary.Created >= 0);
        Assert.True(summary.Updated >= 0);
        Assert.True(summary.Skipped >= 0);
        Assert.True(summary.Conflicts >= 0);
    }

    [Fact]
    public async Task ResolveConflictAsync_ExistingConflict_DeletesAndReturnsTrue()
    {
        var conflict = new SyncConflict
        {
            Id = 5,
            EntityType = "Players",
            EntityKey = "1",
            SqliteSnapshot = "{\"Id\":1,\"Name\":\"TestPlayer\",\"Rating\":1.0,\"Archived\":false}",
            FirestoreSnapshot = "{\"Id\":1,\"Name\":\"TestPlayer\",\"Rating\":1.1,\"Archived\":false}",
            DetectedAt = DateTime.UtcNow
        };

        var conflictRepo = new Mock<ISyncConflictRepository>();
        conflictRepo.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(conflict);
        conflictRepo.Setup(r => r.DeleteAsync(5)).Returns(Task.CompletedTask);

        var playerRepo = new Mock<IPlayerRepository>();
        playerRepo.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Player?)null);

        var svc = BuildService(conflictRepo: conflictRepo, playerRepo: playerRepo);
        var result = await svc.ResolveConflictAsync(5, "sqlite");

        Assert.True(result);
        conflictRepo.Verify(r => r.DeleteAsync(5), Times.Once);
    }
}
