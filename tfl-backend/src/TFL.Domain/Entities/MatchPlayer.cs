namespace TFL.Domain.Entities;

public class MatchPlayer
{
    public int Id { get; set; }
    public string MatchDateKey { get; set; } = string.Empty;
    public int PlayerId { get; set; }
    public int Team { get; set; }
    public double? RatingDiff { get; set; }

    public Match? Match { get; set; }
    public Player? Player { get; set; }
}
