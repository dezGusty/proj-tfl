using TFL.Domain.Enums;

namespace TFL.Domain.Entities;

public class Player
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public double Rating { get; set; }
    public string? Keywords { get; set; }
    public int Affinity { get; set; } = 0;
    public int Stars { get; set; } = 0;
    public bool Reserve { get; set; } = false;
    public bool IsArchived { get; set; } = false;
    public DateTime LastModified { get; set; }
    public string? LinkedUserId { get; set; }

    public AppUser? LinkedUser { get; set; }
    public ICollection<PlayerRecentEntry> RecentEntries { get; set; } = [];
    public ICollection<MatchPlayer> MatchPlayers { get; set; } = [];
    public ICollection<DraftPlayer> DraftPlayers { get; set; } = [];
    public ICollection<GameEventRegistration> GameEventRegistrations { get; set; } = [];
}
