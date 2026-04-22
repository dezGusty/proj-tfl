using TFL.Domain.Enums;

namespace TFL.Application.DTOs;

public record MatchSummaryDto(string DateKey, string Status);

public record PostResultDto(int PlayerId, double Diff);

public record MatchDetailDto(
    string DateKey,
    IReadOnlyList<TeamPlayerDto> Team1,
    IReadOnlyList<TeamPlayerDto> Team2,
    int ScoreTeam1,
    int ScoreTeam2,
    bool SavedResult,
    bool AppliedResults,
    IReadOnlyList<PostResultDto> PostResults,
    string Status,
    DateTime LastModified);

public record CreateMatchRequest(
    string DateKey,
    List<int> Team1PlayerIds,
    List<int> Team2PlayerIds,
    int ScoreTeam1,
    int ScoreTeam2,
    string Status);

public record UpdateMatchRequest(
    int ScoreTeam1,
    int ScoreTeam2,
    string Status);
