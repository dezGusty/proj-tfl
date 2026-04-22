using Microsoft.EntityFrameworkCore;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Infrastructure.Data;

namespace TFL.Infrastructure.Data.Repositories;

public class SyncStateRepository(TflDbContext db) : ISyncStateRepository
{
    public async Task<SyncState?> GetByEntityTypeAsync(string entityType) =>
        await db.SyncStates.FirstOrDefaultAsync(s => s.EntityType == entityType);

    public async Task<List<SyncState>> GetAllAsync() =>
        await db.SyncStates.ToListAsync();

    public async Task<SyncState> SaveAsync(SyncState state)
    {
        var existing = await GetByEntityTypeAsync(state.EntityType);
        if (existing is null)
        {
            db.SyncStates.Add(state);
        }
        else
        {
            existing.LastSyncAt = state.LastSyncAt;
            existing.LastRunSummary = state.LastRunSummary;
        }
        await db.SaveChangesAsync();
        return existing ?? state;
    }
}
