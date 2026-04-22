using TFL.Domain.Entities;

namespace TFL.Application.Interfaces.Repositories;

public interface IRatingSnapshotRepository
{
    Task<List<RatingSnapshot>> GetAllAsync();
    Task<RatingSnapshot> CreateAsync(RatingSnapshot snapshot);
}
