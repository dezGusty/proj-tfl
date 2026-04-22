namespace TFL.Domain.Entities;

public class AppSettings
{
    public int Id { get; set; } = 1;
    public bool AutoSave { get; set; } = true;
    public bool ShowPlayerStatusIcons { get; set; } = true;
    public bool AutoNavigateToTransferredDraft { get; set; } = true;
    public bool RandomizePlayerOrder { get; set; } = false;
    public int RecentMatchesToStore { get; set; } = 8;
    /// <summary>JSON-serialized MatchDaySchedule[]</summary>
    public string DefaultMatchSchedule { get; set; } =
        """[{"dayOfWeek":2,"time":"20:00"},{"dayOfWeek":4,"time":"20:00"}]""";
}
