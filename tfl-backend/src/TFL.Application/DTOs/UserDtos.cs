namespace TFL.Application.DTOs;

public record AppUserDto(
    string Id,
    string Email,
    string? PhotoUrl,
    IReadOnlyList<string> Roles,
    bool Approved,
    bool IsActive,
    int? LinkedPlayerId);

public record ApproveUserRequest(bool Approved);

public record UpdateRolesRequest(List<string> Roles);

public record LinkPlayerRequest(int PlayerId);
