using TFL.Domain.Enums;

namespace TFL.Application.DTOs;

public record GameEventSummaryDto(
    string Name,
    string MatchDate,
    int PlayerCount,
    bool Inactive,
    string MatchStatus);

public record RegistrationDto(int PlayerId, bool IsReserve, int Stars, int SortOrder);

public record GameEventDetailDto(
    string Name,
    string MatchDate,
    IReadOnlyList<RegistrationDto> Registrations,
    bool Inactive,
    string MatchStatus,
    DateTime LastModified);

public record CreateGameEventRequest(string MatchDate, string? TimeSuffix);

public record UpdateGameEventRequest(
    List<RegistrationDto> Registrations,
    bool Inactive,
    string MatchStatus);

public record GameEventSummaryMatrixDto(
    IReadOnlyList<string> Events,
    IReadOnlyList<PlayerEventRowDto> Rows);

public record PlayerEventRowDto(
    int PlayerId,
    string PlayerName,
    string? DisplayName,
    Dictionary<string, EventRegistrationStatusDto> Registrations);

public record EventRegistrationStatusDto(bool Registered, bool IsReserve, int Stars);
