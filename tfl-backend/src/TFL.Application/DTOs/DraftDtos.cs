namespace TFL.Application.DTOs;

public record DraftDto(IReadOnlyList<int> PlayerIds, DateTime LastModified);

public record SaveDraftRequest(List<int> PlayerIds);

public record GenerateTeamsRequest(
    List<int> PlayerIds,
    Dictionary<int, int>? AffinityOverrides);

public record TeamPlayerDto(int Id, string Name, string? DisplayName, double Rating);

public record TeamCombinationDto(
    int Rank,
    IReadOnlyList<TeamPlayerDto> Team1,
    IReadOnlyList<TeamPlayerDto> Team2,
    double Team1TotalRating,
    double Team2TotalRating,
    double RatingDiffAbs);
