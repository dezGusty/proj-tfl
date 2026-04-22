using TFL.Application.DTOs;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;

namespace TFL.Application.Services;

public class TeamBalancingService(IPlayerRepository playerRepository)
{
    public async Task<List<TeamCombinationDto>> GenerateCombinationsAsync(
        List<int> playerIds,
        Dictionary<int, int>? affinityOverrides)
    {
        if (playerIds.Count < 2) return [];

        var players = await playerRepository.GetByIdsAsync(playerIds);
        if (players.Count < 2) return [];

        // Apply affinity overrides
        var playersWithAffinity = players.Select(p =>
        {
            var affinity = affinityOverrides?.TryGetValue(p.Id, out var a) == true ? a : p.Affinity;
            return (Player: p, Affinity: affinity);
        }).ToList();

        var lockedTeam1 = playersWithAffinity.Where(x => x.Affinity == 1).Select(x => x.Player).ToList();
        var lockedTeam2 = playersWithAffinity.Where(x => x.Affinity == 2).Select(x => x.Player).ToList();
        var free = playersWithAffinity.Where(x => x.Affinity == 0).Select(x => x.Player).ToList();

        var total = players.Count;
        var team1Size = total / 2;

        var requiredFreeOnTeam1 = team1Size - lockedTeam1.Count;

        // Validate constraints
        if (requiredFreeOnTeam1 < 0 || requiredFreeOnTeam1 > free.Count)
            return [];

        var combinations = new List<(List<Player> Team1, List<Player> Team2, double Diff)>();

        // Enumerate all subsets of free players for team 1
        foreach (var subset in GetCombinations(free, requiredFreeOnTeam1))
        {
            var team1 = lockedTeam1.Concat(subset).ToList();
            var team2 = lockedTeam2.Concat(free.Except(subset)).ToList();

            var team1Rating = team1.Sum(p => p.Rating);
            var team2Rating = team2.Sum(p => p.Rating);
            var diff = Math.Abs(team1Rating - team2Rating);

            combinations.Add((team1, team2, diff));
        }

        return combinations
            .OrderBy(c => c.Diff)
            .Take(20)
            .Select((c, i) => new TeamCombinationDto(
                i + 1,
                c.Team1.Select(p => new TeamPlayerDto(p.Id, p.Name, p.DisplayName, p.Rating)).ToList(),
                c.Team2.Select(p => new TeamPlayerDto(p.Id, p.Name, p.DisplayName, p.Rating)).ToList(),
                Math.Round(c.Team1.Sum(p => p.Rating), 3),
                Math.Round(c.Team2.Sum(p => p.Rating), 3),
                Math.Round(c.Diff, 3)))
            .ToList();
    }

    private static IEnumerable<List<T>> GetCombinations<T>(List<T> list, int k)
    {
        if (k == 0) { yield return []; yield break; }
        if (k > list.Count) yield break;

        for (var i = 0; i <= list.Count - k; i++)
        {
            foreach (var rest in GetCombinations(list.Skip(i + 1).ToList(), k - 1))
            {
                yield return [list[i], .. rest];
            }
        }
    }
}
