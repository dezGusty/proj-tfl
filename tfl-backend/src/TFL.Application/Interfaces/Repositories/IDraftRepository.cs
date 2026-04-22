using TFL.Domain.Entities;

namespace TFL.Application.Interfaces.Repositories;

public interface IDraftRepository
{
    Task<Draft> GetAsync();
    Task<Draft> SaveAsync(Draft draft);
}
