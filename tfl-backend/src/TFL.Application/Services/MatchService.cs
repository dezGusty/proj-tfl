using TFL.Application.DTOs;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Domain.Enums;

namespace TFL.Application.Services;

public class MatchService(
    IMatchRepository matchRepository,
    IPlayerRepository playerRepository,
    RatingService ratingService)
{
    public async Task<List<MatchSummaryDto>> GetRecentAsync(int count)
    {
        var matches = await matchRepository.GetRecentAsync(count);
        return matches.Select(m => new MatchSummaryDto(m.DateKey, m.Status.ToString().ToLowerInvariant())).ToList();
    }

    public async Task<MatchDetailDto?> GetByDateKeyAsync(string dateKey)
    {
        var match = await matchRepository.GetByDateKeyAsync(dateKey);
        return match is null ? null : await MapToDtoAsync(match);
    }

    public async Task<MatchDetailDto> CreateAsync(CreateMatchRequest request)
    {
        var status = ParseStatus(request.Status);

        var match = new Match
        {
            DateKey = request.DateKey,
            ScoreTeam1 = request.ScoreTeam1,
            ScoreTeam2 = request.ScoreTeam2,
            SavedResult = true,
            Status = status,
            LastModified = DateTime.UtcNow
        };

        foreach (var (id, i) in request.Team1PlayerIds.Select((id, i) => (id, i)))
            match.MatchPlayers.Add(new MatchPlayer { PlayerId = id, Team = 1 });
        foreach (var (id, i) in request.Team2PlayerIds.Select((id, i) => (id, i)))
            match.MatchPlayers.Add(new MatchPlayer { PlayerId = id, Team = 2 });

        if (status == MatchStatus.Valid)
            await ratingService.ApplyMatchResultAsync(match);

        var created = await matchRepository.CreateAsync(match);
        return await MapToDtoAsync(created);
    }

    public async Task<MatchDetailDto?> UpdateAsync(string dateKey, UpdateMatchRequest request)
    {
        var match = await matchRepository.GetByDateKeyAsync(dateKey);
        if (match is null) return null;

        var newStatus = ParseStatus(request.Status);
        var oldStatus = match.Status;

        match.ScoreTeam1 = request.ScoreTeam1;
        match.ScoreTeam2 = request.ScoreTeam2;
        match.Status = newStatus;
        match.LastModified = DateTime.UtcNow;

        // Handle rating transitions
        if (oldStatus == MatchStatus.Valid && newStatus == MatchStatus.NotPlayed)
            await ratingService.ReverseMatchResultAsync(match);
        else if (oldStatus != MatchStatus.Valid && newStatus == MatchStatus.Valid)
            await ratingService.ApplyMatchResultAsync(match);

        var updated = await matchRepository.UpdateAsync(match);
        return await MapToDtoAsync(updated);
    }

    private async Task<MatchDetailDto> MapToDtoAsync(Match match)
    {
        var playerIds = match.MatchPlayers.Select(mp => mp.PlayerId).ToList();
        var players = await playerRepository.GetByIdsAsync(playerIds);
        var playerMap = players.ToDictionary(p => p.Id);

        var team1 = match.MatchPlayers
            .Where(mp => mp.Team == 1)
            .Select(mp => playerMap.TryGetValue(mp.PlayerId, out var p)
                ? new TeamPlayerDto(p.Id, p.Name, p.DisplayName, p.Rating)
                : new TeamPlayerDto(mp.PlayerId, "Unknown", null, 0))
            .ToList();

        var team2 = match.MatchPlayers
            .Where(mp => mp.Team == 2)
            .Select(mp => playerMap.TryGetValue(mp.PlayerId, out var p)
                ? new TeamPlayerDto(p.Id, p.Name, p.DisplayName, p.Rating)
                : new TeamPlayerDto(mp.PlayerId, "Unknown", null, 0))
            .ToList();

        var postResults = match.MatchPlayers
            .Where(mp => mp.RatingDiff.HasValue)
            .Select(mp => new PostResultDto(mp.PlayerId, mp.RatingDiff!.Value))
            .ToList();

        return new MatchDetailDto(
            match.DateKey,
            team1,
            team2,
            match.ScoreTeam1,
            match.ScoreTeam2,
            match.SavedResult,
            match.AppliedResults,
            postResults,
            match.Status.ToString().ToLowerInvariant(),
            match.LastModified);
    }

    private static MatchStatus ParseStatus(string status) =>
        status.ToLowerInvariant() switch
        {
            "valid" => MatchStatus.Valid,
            "unbalanced" => MatchStatus.Unbalanced,
            "not_played" => MatchStatus.NotPlayed,
            _ => MatchStatus.Unknown
        };
}
