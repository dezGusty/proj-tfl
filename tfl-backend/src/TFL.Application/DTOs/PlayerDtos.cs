namespace TFL.Application.DTOs;

public record RecentEntryDto(string Date, double Diff, string? Type);

public record PlayerDto(
    int Id,
    string Name,
    string? DisplayName,
    double Rating,
    string? Keywords,
    int Affinity,
    int Stars,
    bool Reserve,
    bool IsArchived,
    IReadOnlyList<RecentEntryDto> MostRecentMatches,
    DateTime LastModified);

public record CreatePlayerRequest(
    string Name,
    double Rating,
    string? DisplayName,
    string? Keywords,
    int Affinity = 0,
    int Stars = 0,
    bool Reserve = false);

public record UpdatePlayerRequest(
    string Name,
    double Rating,
    string? DisplayName,
    string? Keywords,
    int Affinity,
    int Stars,
    bool Reserve);

public record ArchivePlayerRequest(bool Archived);

public record RatingAdjustmentRequest(double Adjustment, string? Note);
