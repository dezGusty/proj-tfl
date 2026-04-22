using Microsoft.EntityFrameworkCore;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Infrastructure.Data;

namespace TFL.Infrastructure.Data.Repositories;

public class PushSubscriptionRepository(TflDbContext db) : IPushSubscriptionRepository
{
    public async Task<List<PushSubscription>> GetByUserIdAsync(string userId) =>
        await db.PushSubscriptions.Where(ps => ps.UserId == userId).ToListAsync();

    public async Task<PushSubscription?> GetByEndpointAsync(string endpoint) =>
        await db.PushSubscriptions.FirstOrDefaultAsync(ps => ps.Endpoint == endpoint);

    public async Task<PushSubscription> CreateAsync(PushSubscription subscription)
    {
        db.PushSubscriptions.Add(subscription);
        await db.SaveChangesAsync();
        return subscription;
    }

    public async Task DeleteByEndpointAsync(string endpoint)
    {
        var sub = await GetByEndpointAsync(endpoint);
        if (sub is not null)
        {
            db.PushSubscriptions.Remove(sub);
            await db.SaveChangesAsync();
        }
    }
}
