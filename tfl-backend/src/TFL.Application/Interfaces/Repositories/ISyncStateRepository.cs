using TFL.Domain.Entities;

namespace TFL.Application.Interfaces.Repositories;

public interface ISyncStateRepository
{
    Task<SyncState?> GetByEntityTypeAsync(string entityType);
    Task<List<SyncState>> GetAllAsync();
    Task<SyncState> SaveAsync(SyncState state);
}
