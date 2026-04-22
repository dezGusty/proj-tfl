using TFL.Application.DTOs;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Domain.Enums;

namespace TFL.Application.Services;

public class UserService(IAppUserRepository userRepository)
{
    public async Task<List<AppUserDto>> GetAllAsync()
    {
        var users = await userRepository.GetAllAsync();
        return users.Select(MapToDto).ToList();
    }

    public async Task<AppUserDto?> GetByIdAsync(string id)
    {
        var user = await userRepository.GetByIdAsync(id);
        return user is null ? null : MapToDto(user);
    }

    public async Task<AppUserDto?> ApproveAsync(string id, bool approved)
    {
        var user = await userRepository.GetByIdAsync(id);
        if (user is null) return null;
        user.Approved = approved;
        var updated = await userRepository.UpdateAsync(user);
        return MapToDto(updated);
    }

    public async Task<(AppUserDto? Dto, string? Error)> UpdateRolesAsync(string id, List<string> roleStrings)
    {
        var user = await userRepository.GetByIdAsync(id);
        if (user is null) return (null, null);

        var roles = UserRole.None;
        foreach (var r in roleStrings)
        {
            if (!TryParseRole(r, out var role))
                return (null, $"Invalid role: {r}");
            roles |= role;
        }

        // Validate cumulative roles
        if (roles.HasFlag(UserRole.Admin) && !roles.HasFlag(UserRole.Organizer))
            return (null, "Admin role requires Organizer role.");
        if (roles.HasFlag(UserRole.Organizer) && !roles.HasFlag(UserRole.Standard))
            return (null, "Organizer role requires Standard role.");

        user.Roles = roles;
        var updated = await userRepository.UpdateAsync(user);
        return (MapToDto(updated), null);
    }

    public async Task<AppUserDto?> DeactivateAsync(string id)
    {
        var user = await userRepository.GetByIdAsync(id);
        if (user is null) return null;
        user.IsActive = false;
        var updated = await userRepository.UpdateAsync(user);
        return MapToDto(updated);
    }

    public async Task<(AppUserDto? Dto, string? Error)> LinkPlayerAsync(string userId, int playerId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user is null) return (null, null);

        // Check if player is already linked to another user
        var allUsers = await userRepository.GetAllAsync();
        if (allUsers.Any(u => u.Id != userId && u.LinkedPlayerId == playerId))
            return (null, "Player is already linked to another user.");

        user.LinkedPlayerId = playerId;
        var updated = await userRepository.UpdateAsync(user);
        return (MapToDto(updated), null);
    }

    public static AppUserDto MapToDto(AppUser user) => new(
        user.Id,
        user.Email,
        user.PhotoUrl,
        RolesToStrings(user.Roles),
        user.Approved,
        user.IsActive,
        user.LinkedPlayerId);

    public static List<string> RolesToStrings(UserRole roles)
    {
        var result = new List<string>();
        if (roles.HasFlag(UserRole.Standard)) result.Add("standard");
        if (roles.HasFlag(UserRole.Organizer)) result.Add("organizer");
        if (roles.HasFlag(UserRole.Admin)) result.Add("admin");
        return result;
    }

    private static bool TryParseRole(string roleStr, out UserRole role)
    {
        role = roleStr.ToLowerInvariant() switch
        {
            "standard" => UserRole.Standard,
            "organizer" => UserRole.Organizer,
            "admin" => UserRole.Admin,
            _ => UserRole.None
        };
        return role != UserRole.None;
    }
}
