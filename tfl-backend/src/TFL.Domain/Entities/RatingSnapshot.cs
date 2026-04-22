namespace TFL.Domain.Entities;

public class RatingSnapshot
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public int Version { get; set; }
    public string PlayersJson { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
