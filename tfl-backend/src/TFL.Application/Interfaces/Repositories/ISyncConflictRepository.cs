using TFL.Domain.Entities;

namespace TFL.Application.Interfaces.Repositories;

public interface ISyncConflictRepository
{
    Task<List<SyncConflict>> GetAllAsync();
    Task<SyncConflict?> GetByIdAsync(int id);
    Task<SyncConflict?> GetByEntityAsync(string entityType, string entityKey);
    Task<SyncConflict> CreateOrUpdateAsync(SyncConflict conflict);
    Task DeleteAsync(int id);
    Task<int> GetCountAsync();
}
