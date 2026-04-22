using Microsoft.EntityFrameworkCore;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Infrastructure.Data;

namespace TFL.Infrastructure.Data.Repositories;

public class SyncConflictRepository(TflDbContext db) : ISyncConflictRepository
{
    public async Task<List<SyncConflict>> GetAllAsync() =>
        await db.SyncConflicts.OrderBy(c => c.DetectedAt).ToListAsync();

    public async Task<SyncConflict?> GetByIdAsync(int id) =>
        await db.SyncConflicts.FindAsync(id);

    public async Task<SyncConflict?> GetByEntityAsync(string entityType, string entityKey) =>
        await db.SyncConflicts.FirstOrDefaultAsync(c => c.EntityType == entityType && c.EntityKey == entityKey);

    public async Task<SyncConflict> CreateOrUpdateAsync(SyncConflict conflict)
    {
        var existing = await GetByEntityAsync(conflict.EntityType, conflict.EntityKey);
        if (existing is not null)
        {
            existing.SqliteSnapshot = conflict.SqliteSnapshot;
            existing.FirestoreSnapshot = conflict.FirestoreSnapshot;
            existing.DetectedAt = conflict.DetectedAt;
            await db.SaveChangesAsync();
            return existing;
        }
        db.SyncConflicts.Add(conflict);
        await db.SaveChangesAsync();
        return conflict;
    }

    public async Task DeleteAsync(int id)
    {
        var conflict = await db.SyncConflicts.FindAsync(id);
        if (conflict is not null)
        {
            db.SyncConflicts.Remove(conflict);
            await db.SaveChangesAsync();
        }
    }

    public async Task<int> GetCountAsync() =>
        await db.SyncConflicts.CountAsync();
}
