using TFL.Domain.Entities;

namespace TFL.Application.Interfaces.Repositories;

public interface IGameEventRepository
{
    Task<List<GameEvent>> GetAllActiveAsync();
    Task<List<GameEvent>> GetAllAsync();
    Task<GameEvent?> GetByNameAsync(string name);
    Task<GameEvent> CreateAsync(GameEvent gameEvent);
    Task<GameEvent> UpdateAsync(GameEvent gameEvent);
}
