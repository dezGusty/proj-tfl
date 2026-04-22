using TFL.Domain.Entities;

namespace TFL.Application.Interfaces.Repositories;

public interface IPlayerRepository
{
    Task<List<Player>> GetAllActiveAsync();
    Task<List<Player>> GetAllArchivedAsync();
    Task<Player?> GetByIdAsync(int id);
    Task<List<Player>> GetByIdsAsync(IEnumerable<int> ids);
    Task<Player> CreateAsync(Player player);
    Task<Player> UpdateAsync(Player player);
    Task DeleteAsync(int id);
    Task<List<Player>> GetAllIncludingArchivedAsync();
}
