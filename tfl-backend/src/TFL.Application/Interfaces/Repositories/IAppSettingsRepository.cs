using TFL.Domain.Entities;

namespace TFL.Application.Interfaces.Repositories;

public interface IAppSettingsRepository
{
    Task<AppSettings> GetAsync();
    Task<AppSettings> UpdateAsync(AppSettings settings);
}
