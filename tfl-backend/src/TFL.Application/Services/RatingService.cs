using TFL.Application.DTOs;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Domain.Enums;

namespace TFL.Application.Services;

public class RatingService(IPlayerRepository playerRepository, IAppSettingsRepository settingsRepository)
{
    private const double FixedMultiplier = 0.05;
    private const double GoalMultiplier = 0.011;

    public static double CalculateAdjustment(int scoreTeam1, int scoreTeam2)
    {
        var goalDiff = Math.Abs(scoreTeam1 - scoreTeam2);
        return FixedMultiplier + goalDiff * GoalMultiplier;
    }

    public async Task ApplyMatchResultAsync(Match match)
    {
        if (match.Status != MatchStatus.Valid) return;

        var settings = await settingsRepository.GetAsync();
        var adjustment = CalculateAdjustment(match.ScoreTeam1, match.ScoreTeam2);

        var winnerTeam = match.ScoreTeam1 > match.ScoreTeam2 ? 1 : 2;
        var playerIds = match.MatchPlayers.Select(mp => mp.PlayerId).ToList();
        var players = await playerRepository.GetByIdsAsync(playerIds);
        var playerMap = players.ToDictionary(p => p.Id);

        foreach (var matchPlayer in match.MatchPlayers)
        {
            if (!playerMap.TryGetValue(matchPlayer.PlayerId, out var player)) continue;

            var isWinner = matchPlayer.Team == winnerTeam;
            var diff = isWinner ? adjustment : -adjustment;

            player.Rating += diff;
            player.LastModified = DateTime.UtcNow;
            matchPlayer.RatingDiff = diff;

            var maxSortOrder = player.RecentEntries.Any() ? player.RecentEntries.Max(e => e.SortOrder) : -1;
            player.RecentEntries.Add(new PlayerRecentEntry
            {
                PlayerId = player.Id,
                MatchDate = match.DateKey,
                Diff = diff,
                EntryType = RecentEntryType.Normal,
                SortOrder = maxSortOrder + 1
            });

            // Enforce rolling window
            while (player.RecentEntries.Count > settings.RecentMatchesToStore)
            {
                var oldest = player.RecentEntries.OrderBy(e => e.SortOrder).First();
                player.RecentEntries.Remove(oldest);
            }

            await playerRepository.UpdateAsync(player);
        }

        match.AppliedResults = true;
        match.LastModified = DateTime.UtcNow;
    }

    public async Task ReverseMatchResultAsync(Match match)
    {
        var playerIds = match.MatchPlayers.Select(mp => mp.PlayerId).ToList();
        var players = await playerRepository.GetByIdsAsync(playerIds);
        var playerMap = players.ToDictionary(p => p.Id);

        foreach (var matchPlayer in match.MatchPlayers)
        {
            if (!playerMap.TryGetValue(matchPlayer.PlayerId, out var player)) continue;
            if (matchPlayer.RatingDiff is null) continue;

            player.Rating -= matchPlayer.RatingDiff.Value;
            player.LastModified = DateTime.UtcNow;

            var entryToRemove = player.RecentEntries
                .FirstOrDefault(e => e.MatchDate == match.DateKey && e.EntryType == RecentEntryType.Normal);
            if (entryToRemove is not null)
                player.RecentEntries.Remove(entryToRemove);

            await playerRepository.UpdateAsync(player);
        }

        match.AppliedResults = false;
        match.LastModified = DateTime.UtcNow;
    }
}
