namespace TFL.Application.DTOs;

public record SyncRunSummaryDto(
    int Created,
    int Updated,
    int Skipped,
    int Conflicts,
    int SoftDeleted,
    long DurationMs);

public record SyncStatusDto(
    Dictionary<string, DateTime?> LastSyncAt,
    int UnresolvedConflicts,
    Dictionary<string, SyncRunSummaryDto?> LastRunSummaries);

public record SyncConflictDto(
    int Id,
    string EntityType,
    string EntityKey,
    object SqliteSnapshot,
    object FirestoreSnapshot,
    DateTime DetectedAt);

public record ResolveConflictRequest(string Winner);
