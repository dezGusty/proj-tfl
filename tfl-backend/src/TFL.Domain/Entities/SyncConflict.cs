using TFL.Domain.Enums;

namespace TFL.Domain.Entities;

public class SyncConflict
{
    public int Id { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public string EntityKey { get; set; } = string.Empty;
    public string SqliteSnapshot { get; set; } = string.Empty;
    public string FirestoreSnapshot { get; set; } = string.Empty;
    public DateTime DetectedAt { get; set; }
}
