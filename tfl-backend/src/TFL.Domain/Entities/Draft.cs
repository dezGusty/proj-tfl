namespace TFL.Domain.Entities;

public class Draft
{
    public int Id { get; set; } = 1;
    public DateTime LastModified { get; set; }

    public ICollection<DraftPlayer> DraftPlayers { get; set; } = [];
}
