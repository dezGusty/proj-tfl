namespace TFL.Domain.Entities;

public class ExternalMailEntry
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool Active { get; set; } = true;
}
