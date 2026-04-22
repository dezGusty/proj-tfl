using TFL.Domain.Entities;

namespace TFL.Application.Interfaces.Repositories;

public interface IExternalMailRepository
{
    Task<List<ExternalMailEntry>> GetAllActiveAsync();
    Task<List<ExternalMailEntry>> GetAllAsync();
    Task<ExternalMailEntry> CreateAsync(ExternalMailEntry entry);
    Task DeleteAsync(int id);
}
