using Microsoft.EntityFrameworkCore;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Infrastructure.Data;

namespace TFL.Infrastructure.Data.Repositories;

public class ExternalMailRepository(TflDbContext db) : IExternalMailRepository
{
    public async Task<List<ExternalMailEntry>> GetAllActiveAsync() =>
        await db.ExternalMailList.Where(e => e.Active).ToListAsync();

    public async Task<List<ExternalMailEntry>> GetAllAsync() =>
        await db.ExternalMailList.ToListAsync();

    public async Task<ExternalMailEntry> CreateAsync(ExternalMailEntry entry)
    {
        db.ExternalMailList.Add(entry);
        await db.SaveChangesAsync();
        return entry;
    }

    public async Task DeleteAsync(int id)
    {
        var entry = await db.ExternalMailList.FindAsync(id);
        if (entry is not null)
        {
            db.ExternalMailList.Remove(entry);
            await db.SaveChangesAsync();
        }
    }
}
