using Microsoft.EntityFrameworkCore;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Infrastructure.Data;

namespace TFL.Infrastructure.Data.Repositories;

public class AppUserRepository(TflDbContext db) : IAppUserRepository
{
    public async Task<List<AppUser>> GetAllAsync() =>
        await db.AppUsers.ToListAsync();

    public async Task<AppUser?> GetByIdAsync(string id) =>
        await db.AppUsers.FirstOrDefaultAsync(u => u.Id == id);

    public async Task<AppUser?> GetByEmailAsync(string email) =>
        await db.AppUsers.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<AppUser> UpsertAsync(AppUser user)
    {
        var existing = await db.AppUsers.FindAsync(user.Id);
        if (existing is null)
        {
            db.AppUsers.Add(user);
        }
        else
        {
            existing.Email = user.Email;
            existing.PhotoUrl = user.PhotoUrl;
        }
        await db.SaveChangesAsync();
        return existing ?? user;
    }

    public async Task<AppUser> UpdateAsync(AppUser user)
    {
        db.AppUsers.Update(user);
        await db.SaveChangesAsync();
        return user;
    }
}
