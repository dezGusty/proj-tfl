namespace TFL.Application.DTOs;

public record MatchDayScheduleDto(int DayOfWeek, string Time);

public record AppSettingsDto(
    bool AutoSave,
    IReadOnlyList<MatchDayScheduleDto> DefaultMatchSchedule,
    bool ShowPlayerStatusIcons,
    bool AutoNavigateToTransferredDraft,
    bool RandomizePlayerOrder,
    int RecentMatchesToStore);
