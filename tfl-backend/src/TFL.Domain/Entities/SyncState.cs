namespace TFL.Domain.Entities;

public class SyncState
{
    public string EntityType { get; set; } = string.Empty;
    public DateTime? LastSyncAt { get; set; }
    public string? LastRunSummary { get; set; }
}
