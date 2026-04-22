using TFL.Domain.Entities;

namespace TFL.Application.Interfaces.Repositories;

public interface IAppUserRepository
{
    Task<List<AppUser>> GetAllAsync();
    Task<AppUser?> GetByIdAsync(string id);
    Task<AppUser?> GetByEmailAsync(string email);
    Task<AppUser> UpsertAsync(AppUser user);
    Task<AppUser> UpdateAsync(AppUser user);
}
