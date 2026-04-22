using TFL.Domain.Enums;

namespace TFL.Domain.Entities;

public class AppUser
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public UserRole Roles { get; set; } = UserRole.Standard;
    public bool Approved { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public int? LinkedPlayerId { get; set; }

    public Player? LinkedPlayer { get; set; }
    public ICollection<PushSubscription> PushSubscriptions { get; set; } = [];
}
