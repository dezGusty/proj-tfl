using TFL.Domain.Entities;

namespace TFL.Application.Interfaces.Repositories;

public interface IPushSubscriptionRepository
{
    Task<List<PushSubscription>> GetByUserIdAsync(string userId);
    Task<PushSubscription?> GetByEndpointAsync(string endpoint);
    Task<PushSubscription> CreateAsync(PushSubscription subscription);
    Task DeleteByEndpointAsync(string endpoint);
}
