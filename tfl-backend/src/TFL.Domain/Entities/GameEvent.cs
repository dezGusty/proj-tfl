using TFL.Domain.Enums;

namespace TFL.Domain.Entities;

public class GameEvent
{
    public string Name { get; set; } = string.Empty;
    public string MatchDate { get; set; } = string.Empty;
    public bool Inactive { get; set; } = false;
    public MatchStatus MatchStatus { get; set; } = MatchStatus.Unknown;
    public DateTime LastModified { get; set; }

    public ICollection<GameEventRegistration> Registrations { get; set; } = [];
}
