using Microsoft.EntityFrameworkCore;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Infrastructure.Data;

namespace TFL.Infrastructure.Data.Repositories;

public class PlayerRepository(TflDbContext db) : IPlayerRepository
{
    public async Task<List<Player>> GetAllActiveAsync() =>
        await db.Players
            .Include(p => p.RecentEntries)
            .Where(p => !p.IsArchived)
            .OrderBy(p => p.Name)
            .ToListAsync();

    public async Task<List<Player>> GetAllArchivedAsync() =>
        await db.Players
            .Include(p => p.RecentEntries)
            .Where(p => p.IsArchived)
            .OrderBy(p => p.Name)
            .ToListAsync();

    public async Task<Player?> GetByIdAsync(int id) =>
        await db.Players
            .Include(p => p.RecentEntries)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<List<Player>> GetByIdsAsync(IEnumerable<int> ids)
    {
        var idList = ids.ToList();
        return await db.Players
            .Include(p => p.RecentEntries)
            .Where(p => idList.Contains(p.Id))
            .ToListAsync();
    }

    public async Task<Player> CreateAsync(Player player)
    {
        db.Players.Add(player);
        await db.SaveChangesAsync();
        return player;
    }

    public async Task<Player> UpdateAsync(Player player)
    {
        db.Players.Update(player);
        await db.SaveChangesAsync();
        return player;
    }

    public async Task DeleteAsync(int id)
    {
        var player = await db.Players.FindAsync(id);
        if (player is not null)
        {
            db.Players.Remove(player);
            await db.SaveChangesAsync();
        }
    }

    public async Task<List<Player>> GetAllIncludingArchivedAsync() =>
        await db.Players
            .Include(p => p.RecentEntries)
            .ToListAsync();
}
