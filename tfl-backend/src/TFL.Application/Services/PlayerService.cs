using TFL.Application.DTOs;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Domain.Enums;

namespace TFL.Application.Services;

public class PlayerService(IPlayerRepository playerRepository, IAppSettingsRepository settingsRepository)
{
    public async Task<List<PlayerDto>> GetAllActiveAsync()
    {
        var players = await playerRepository.GetAllActiveAsync();
        return players.Select(MapToDto).ToList();
    }

    public async Task<List<PlayerDto>> GetAllArchivedAsync()
    {
        var players = await playerRepository.GetAllArchivedAsync();
        return players.Select(MapToDto).ToList();
    }

    public async Task<PlayerDto?> GetByIdAsync(int id)
    {
        var player = await playerRepository.GetByIdAsync(id);
        return player is null ? null : MapToDto(player);
    }

    public async Task<PlayerDto> CreateAsync(CreatePlayerRequest request)
    {
        var player = new Player
        {
            Name = request.Name,
            Rating = request.Rating,
            DisplayName = request.DisplayName,
            Keywords = request.Keywords,
            Affinity = request.Affinity,
            Stars = request.Stars,
            Reserve = request.Reserve,
            LastModified = DateTime.UtcNow
        };
        var created = await playerRepository.CreateAsync(player);
        return MapToDto(created);
    }

    public async Task<PlayerDto?> UpdateAsync(int id, UpdatePlayerRequest request)
    {
        var player = await playerRepository.GetByIdAsync(id);
        if (player is null) return null;

        player.Name = request.Name;
        player.Rating = request.Rating;
        player.DisplayName = request.DisplayName;
        player.Keywords = request.Keywords;
        player.Affinity = request.Affinity;
        player.Stars = request.Stars;
        player.Reserve = request.Reserve;
        player.LastModified = DateTime.UtcNow;

        var updated = await playerRepository.UpdateAsync(player);
        return MapToDto(updated);
    }

    public async Task<PlayerDto?> SetArchivedAsync(int id, bool archived)
    {
        var player = await playerRepository.GetByIdAsync(id);
        if (player is null) return null;

        player.IsArchived = archived;
        player.LastModified = DateTime.UtcNow;

        var updated = await playerRepository.UpdateAsync(player);
        return MapToDto(updated);
    }

    public async Task<PlayerDto?> ApplyManualRatingAdjustmentAsync(int id, double adjustment, string? note)
    {
        var player = await playerRepository.GetByIdAsync(id);
        if (player is null) return null;

        var settings = await settingsRepository.GetAsync();
        player.Rating += adjustment;
        player.LastModified = DateTime.UtcNow;

        // Add a recent entry for the manual edit
        var maxSortOrder = player.RecentEntries.Any() ? player.RecentEntries.Max(e => e.SortOrder) : -1;
        var entry = new PlayerRecentEntry
        {
            PlayerId = player.Id,
            MatchDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            Diff = adjustment,
            EntryType = RecentEntryType.ManualEdit,
            SortOrder = maxSortOrder + 1
        };
        player.RecentEntries.Add(entry);

        // Enforce rolling window
        if (player.RecentEntries.Count > settings.RecentMatchesToStore)
        {
            var oldest = player.RecentEntries.OrderBy(e => e.SortOrder).First();
            player.RecentEntries.Remove(oldest);
        }

        var updated = await playerRepository.UpdateAsync(player);
        return MapToDto(updated);
    }

    public static PlayerDto MapToDto(Player player) => new(
        player.Id,
        player.Name,
        player.DisplayName,
        player.Rating,
        player.Keywords,
        player.Affinity,
        player.Stars,
        player.Reserve,
        player.IsArchived,
        player.RecentEntries
            .OrderBy(e => e.SortOrder)
            .Select(e => new RecentEntryDto(
                e.MatchDate,
                e.Diff,
                e.EntryType == RecentEntryType.Normal ? null : e.EntryType.ToString().ToLowerInvariant()))
            .ToList(),
        player.LastModified);
}
