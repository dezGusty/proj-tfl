using TFL.Domain.Enums;

namespace TFL.Domain.Entities;

public class PlayerRecentEntry
{
    public int Id { get; set; }
    public int PlayerId { get; set; }
    public string MatchDate { get; set; } = string.Empty;
    public double Diff { get; set; }
    public RecentEntryType EntryType { get; set; } = RecentEntryType.Normal;
    public int SortOrder { get; set; }

    public Player? Player { get; set; }
}
