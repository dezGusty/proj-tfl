using TFL.Domain.Enums;

namespace TFL.Domain.Entities;

public class Match
{
    public string DateKey { get; set; } = string.Empty;
    public int ScoreTeam1 { get; set; } = 0;
    public int ScoreTeam2 { get; set; } = 0;
    public bool SavedResult { get; set; } = false;
    public bool AppliedResults { get; set; } = false;
    public MatchStatus Status { get; set; } = MatchStatus.Unknown;
    public DateTime LastModified { get; set; }

    public ICollection<MatchPlayer> MatchPlayers { get; set; } = [];
}
