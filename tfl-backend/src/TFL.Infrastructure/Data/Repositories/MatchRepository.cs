using Microsoft.EntityFrameworkCore;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Infrastructure.Data;

namespace TFL.Infrastructure.Data.Repositories;

public class MatchRepository(TflDbContext db) : IMatchRepository
{
    public async Task<List<Match>> GetRecentAsync(int count) =>
        await db.Matches
            .Include(m => m.MatchPlayers)
            .OrderByDescending(m => m.DateKey)
            .Take(count)
            .ToListAsync();

    public async Task<Match?> GetByDateKeyAsync(string dateKey) =>
        await db.Matches
            .Include(m => m.MatchPlayers)
            .FirstOrDefaultAsync(m => m.DateKey == dateKey);

    public async Task<Match> CreateAsync(Match match)
    {
        db.Matches.Add(match);
        await db.SaveChangesAsync();
        return match;
    }

    public async Task<Match> UpdateAsync(Match match)
    {
        db.Matches.Update(match);
        await db.SaveChangesAsync();
        return match;
    }

    public async Task<List<Match>> GetAllAsync() =>
        await db.Matches
            .Include(m => m.MatchPlayers)
            .ToListAsync();
}
