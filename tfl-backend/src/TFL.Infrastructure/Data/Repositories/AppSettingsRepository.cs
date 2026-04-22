using Microsoft.EntityFrameworkCore;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Infrastructure.Data;

namespace TFL.Infrastructure.Data.Repositories;

public class AppSettingsRepository(TflDbContext db) : IAppSettingsRepository
{
    public async Task<AppSettings> GetAsync()
    {
        var settings = await db.AppSettings.FirstOrDefaultAsync(s => s.Id == 1);
        if (settings is null)
        {
            settings = new AppSettings { Id = 1 };
            db.AppSettings.Add(settings);
            await db.SaveChangesAsync();
        }
        return settings;
    }

    public async Task<AppSettings> UpdateAsync(AppSettings settings)
    {
        db.AppSettings.Update(settings);
        await db.SaveChangesAsync();
        return settings;
    }
}
