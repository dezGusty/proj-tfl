using TFL.Domain.Entities;

namespace TFL.Application.Interfaces.Repositories;

public interface IMatchRepository
{
    Task<List<Match>> GetRecentAsync(int count);
    Task<Match?> GetByDateKeyAsync(string dateKey);
    Task<Match> CreateAsync(Match match);
    Task<Match> UpdateAsync(Match match);
    Task<List<Match>> GetAllAsync();
}
