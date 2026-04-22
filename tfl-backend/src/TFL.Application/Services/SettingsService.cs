using System.Text.Json;
using TFL.Application.DTOs;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;

namespace TFL.Application.Services;

public class SettingsService(IAppSettingsRepository settingsRepository)
{
    public async Task<AppSettingsDto> GetAsync()
    {
        var settings = await settingsRepository.GetAsync();
        return MapToDto(settings);
    }

    public async Task<AppSettingsDto> UpdateAsync(AppSettingsDto dto)
    {
        var settings = await settingsRepository.GetAsync();
        settings.AutoSave = dto.AutoSave;
        settings.ShowPlayerStatusIcons = dto.ShowPlayerStatusIcons;
        settings.AutoNavigateToTransferredDraft = dto.AutoNavigateToTransferredDraft;
        settings.RandomizePlayerOrder = dto.RandomizePlayerOrder;
        settings.RecentMatchesToStore = Math.Clamp(dto.RecentMatchesToStore, 4, 12);
        settings.DefaultMatchSchedule = JsonSerializer.Serialize(dto.DefaultMatchSchedule);

        var updated = await settingsRepository.UpdateAsync(settings);
        return MapToDto(updated);
    }

    private static AppSettingsDto MapToDto(AppSettings settings)
    {
        var schedules = JsonSerializer.Deserialize<List<MatchDayScheduleDto>>(settings.DefaultMatchSchedule)
            ?? [];
        return new AppSettingsDto(
            settings.AutoSave,
            schedules,
            settings.ShowPlayerStatusIcons,
            settings.AutoNavigateToTransferredDraft,
            settings.RandomizePlayerOrder,
            settings.RecentMatchesToStore);
    }
}
