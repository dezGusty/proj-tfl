namespace TFL.Domain.Enums;

[Flags]
public enum UserRole
{
    None = 0,
    Standard = 1,
    Organizer = 2,
    Admin = 4
}
