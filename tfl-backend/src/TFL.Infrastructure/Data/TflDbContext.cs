using Microsoft.EntityFrameworkCore;
using TFL.Domain.Entities;

namespace TFL.Infrastructure.Data;

public class TflDbContext(DbContextOptions<TflDbContext> options) : DbContext(options)
{
    public DbSet<Player> Players => Set<Player>();
    public DbSet<PlayerRecentEntry> PlayerRecentEntries => Set<PlayerRecentEntry>();
    public DbSet<Match> Matches => Set<Match>();
    public DbSet<MatchPlayer> MatchPlayers => Set<MatchPlayer>();
    public DbSet<GameEvent> GameEvents => Set<GameEvent>();
    public DbSet<GameEventRegistration> GameEventRegistrations => Set<GameEventRegistration>();
    public DbSet<Draft> Drafts => Set<Draft>();
    public DbSet<DraftPlayer> DraftPlayers => Set<DraftPlayer>();
    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<AppSettings> AppSettings => Set<AppSettings>();
    public DbSet<SyncState> SyncStates => Set<SyncState>();
    public DbSet<SyncConflict> SyncConflicts => Set<SyncConflict>();
    public DbSet<RatingSnapshot> RatingSnapshots => Set<RatingSnapshot>();
    public DbSet<PushSubscription> PushSubscriptions => Set<PushSubscription>();
    public DbSet<ExternalMailEntry> ExternalMailList => Set<ExternalMailEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TflDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (optionsBuilder.IsConfigured) return;
        base.OnConfiguring(optionsBuilder);
    }
}
