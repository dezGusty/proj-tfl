namespace TFL.Domain.Entities;

public class DraftPlayer
{
    public int Id { get; set; }
    public int DraftId { get; set; }
    public int PlayerId { get; set; }
    public int SortOrder { get; set; }

    public Draft? Draft { get; set; }
    public Player? Player { get; set; }
}
