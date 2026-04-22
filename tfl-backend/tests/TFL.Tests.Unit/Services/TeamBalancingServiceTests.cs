using Moq;
using TFL.Application.DTOs;
using TFL.Application.Interfaces.Repositories;
using TFL.Application.Services;
using TFL.Domain.Entities;

namespace TFL.Tests.Unit.Services;

public class TeamBalancingServiceTests
{
    private static Mock<IPlayerRepository> MockRepo(List<Player> players)
    {
        var mock = new Mock<IPlayerRepository>();
        mock.Setup(r => r.GetByIdsAsync(It.IsAny<List<int>>()))
            .ReturnsAsync((List<int> ids) => players.Where(p => ids.Contains(p.Id)).ToList());
        return mock;
    }

    private static Player P(int id, string name, double rating) =>
        new() { Id = id, Name = name, DisplayName = name, Rating = rating, Affinity = 0 };

    [Fact]
    public async Task TwoPlayers_ReturnsNonEmptyCombinations()
    {
        var players = new List<Player> { P(1, "A", 1.0), P(2, "B", 1.0) };
        var svc = new TeamBalancingService(MockRepo(players).Object);

        var result = await svc.GenerateCombinationsAsync([1, 2], null);

        Assert.NotEmpty(result);
        Assert.All(result, c => Assert.Equal(1, c.Team1.Count));
        Assert.All(result, c => Assert.Equal(1, c.Team2.Count));
    }

    [Fact]
    public async Task FourEqualPlayers_FirstCombinationHasZeroDiff()
    {
        var players = Enumerable.Range(1, 4).Select(i => P(i, $"P{i}", 1.0)).ToList();
        var svc = new TeamBalancingService(MockRepo(players).Object);

        var result = await svc.GenerateCombinationsAsync(players.Select(p => p.Id).ToList(), null);

        Assert.NotEmpty(result);
        Assert.Equal(0.0, result[0].RatingDiffAbs, precision: 4);
    }

    [Fact]
    public async Task ResultsSortedByDiffAscending()
    {
        var players = new List<Player>
        {
            P(1, "A", 2.0), P(2, "B", 1.0), P(3, "C", 0.5), P(4, "D", 0.5)
        };
        var svc = new TeamBalancingService(MockRepo(players).Object);

        var result = await svc.GenerateCombinationsAsync(players.Select(p => p.Id).ToList(), null);

        for (var i = 1; i < result.Count; i++)
            Assert.True(result[i].RatingDiffAbs >= result[i - 1].RatingDiffAbs);
    }

    [Fact]
    public async Task AtMostTwentyCombinationsReturned()
    {
        // 10 players → C(10,5) = 252 combos → should cap at 20
        var players = Enumerable.Range(1, 10).Select(i => P(i, $"P{i}", i * 0.1)).ToList();
        var svc = new TeamBalancingService(MockRepo(players).Object);

        var result = await svc.GenerateCombinationsAsync(players.Select(p => p.Id).ToList(), null);

        Assert.True(result.Count <= 20);
    }

    [Fact]
    public async Task LockedAffinityPlayersStayOnCorrectTeam()
    {
        var players = new List<Player>
        {
            new() { Id = 1, Name = "A", DisplayName = "A", Rating = 1.0, Affinity = 1 },
            new() { Id = 2, Name = "B", DisplayName = "B", Rating = 1.0, Affinity = 2 },
            new() { Id = 3, Name = "C", DisplayName = "C", Rating = 1.0, Affinity = 0 },
            new() { Id = 4, Name = "D", DisplayName = "D", Rating = 1.0, Affinity = 0 }
        };
        var svc = new TeamBalancingService(MockRepo(players).Object);

        var result = await svc.GenerateCombinationsAsync(players.Select(p => p.Id).ToList(), null);

        Assert.NotEmpty(result);
        Assert.All(result, c => Assert.Contains(c.Team1, p => p.Id == 1));
        Assert.All(result, c => Assert.Contains(c.Team2, p => p.Id == 2));
    }

    [Fact]
    public async Task AffinityOverridesUsedInsteadOfPlayerAffinity()
    {
        var players = new List<Player>
        {
            new() { Id = 1, Name = "A", DisplayName = "A", Rating = 1.0, Affinity = 0 },
            new() { Id = 2, Name = "B", DisplayName = "B", Rating = 1.0, Affinity = 0 },
            new() { Id = 3, Name = "C", DisplayName = "C", Rating = 1.0, Affinity = 0 },
            new() { Id = 4, Name = "D", DisplayName = "D", Rating = 1.0, Affinity = 0 }
        };
        var overrides = new Dictionary<int, int> { [1] = 1, [2] = 2 };
        var svc = new TeamBalancingService(MockRepo(players).Object);

        var result = await svc.GenerateCombinationsAsync(players.Select(p => p.Id).ToList(), overrides);

        Assert.NotEmpty(result);
        Assert.All(result, c => Assert.Contains(c.Team1, p => p.Id == 1));
        Assert.All(result, c => Assert.Contains(c.Team2, p => p.Id == 2));
    }

    [Fact]
    public async Task EmptyPlayerIds_ReturnsEmpty()
    {
        var svc = new TeamBalancingService(MockRepo([]).Object);
        var result = await svc.GenerateCombinationsAsync([], null);
        Assert.Empty(result);
    }

    [Fact]
    public async Task RankOneIndexedStartsAtOne()
    {
        var players = Enumerable.Range(1, 4).Select(i => P(i, $"P{i}", 1.0)).ToList();
        var svc = new TeamBalancingService(MockRepo(players).Object);

        var result = await svc.GenerateCombinationsAsync(players.Select(p => p.Id).ToList(), null);

        Assert.Equal(1, result[0].Rank);
    }

    [Fact]
    public async Task TeamSizeEquallyDivided()
    {
        var players = Enumerable.Range(1, 6).Select(i => P(i, $"P{i}", 1.0)).ToList();
        var svc = new TeamBalancingService(MockRepo(players).Object);

        var result = await svc.GenerateCombinationsAsync(players.Select(p => p.Id).ToList(), null);

        Assert.All(result, c =>
        {
            Assert.Equal(3, c.Team1.Count);
            Assert.Equal(3, c.Team2.Count);
        });
    }
}
