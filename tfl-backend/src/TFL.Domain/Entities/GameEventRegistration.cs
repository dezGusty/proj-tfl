namespace TFL.Domain.Entities;

public class GameEventRegistration
{
    public int Id { get; set; }
    public string GameEventName { get; set; } = string.Empty;
    public int PlayerId { get; set; }
    public bool IsReserve { get; set; } = false;
    public int Stars { get; set; } = 0;
    public int SortOrder { get; set; } = 0;

    public GameEvent? GameEvent { get; set; }
    public Player? Player { get; set; }
}
