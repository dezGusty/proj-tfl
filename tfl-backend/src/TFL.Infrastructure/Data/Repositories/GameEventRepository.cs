using Microsoft.EntityFrameworkCore;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Infrastructure.Data;

namespace TFL.Infrastructure.Data.Repositories;

public class GameEventRepository(TflDbContext db) : IGameEventRepository
{
    public async Task<List<GameEvent>> GetAllActiveAsync() =>
        await db.GameEvents
            .Include(e => e.Registrations)
            .Where(e => !e.Inactive)
            .OrderByDescending(e => e.MatchDate)
            .ToListAsync();

    public async Task<List<GameEvent>> GetAllAsync() =>
        await db.GameEvents
            .Include(e => e.Registrations)
            .ToListAsync();

    public async Task<GameEvent?> GetByNameAsync(string name) =>
        await db.GameEvents
            .Include(e => e.Registrations)
            .FirstOrDefaultAsync(e => e.Name == name);

    public async Task<GameEvent> CreateAsync(GameEvent gameEvent)
    {
        db.GameEvents.Add(gameEvent);
        await db.SaveChangesAsync();
        return gameEvent;
    }

    public async Task<GameEvent> UpdateAsync(GameEvent gameEvent)
    {
        // Remove old registrations and replace
        var existing = await db.GameEvents
            .Include(e => e.Registrations)
            .FirstOrDefaultAsync(e => e.Name == gameEvent.Name);

        if (existing is not null)
        {
            existing.Inactive = gameEvent.Inactive;
            existing.MatchStatus = gameEvent.MatchStatus;
            existing.LastModified = gameEvent.LastModified;

            db.GameEventRegistrations.RemoveRange(existing.Registrations);
            foreach (var reg in gameEvent.Registrations)
            {
                reg.GameEventName = existing.Name;
                existing.Registrations.Add(reg);
            }
            await db.SaveChangesAsync();
            return existing;
        }

        db.GameEvents.Update(gameEvent);
        await db.SaveChangesAsync();
        return gameEvent;
    }
}
