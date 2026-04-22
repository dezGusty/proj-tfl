using Microsoft.EntityFrameworkCore;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Infrastructure.Data;

namespace TFL.Infrastructure.Data.Repositories;

public class RatingSnapshotRepository(TflDbContext db) : IRatingSnapshotRepository
{
    public async Task<List<RatingSnapshot>> GetAllAsync() =>
        await db.RatingSnapshots.OrderByDescending(s => s.Version).ToListAsync();

    public async Task<RatingSnapshot> CreateAsync(RatingSnapshot snapshot)
    {
        db.RatingSnapshots.Add(snapshot);
        await db.SaveChangesAsync();
        return snapshot;
    }
}
