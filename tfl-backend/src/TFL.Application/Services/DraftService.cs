using TFL.Application.DTOs;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Domain.Enums;

namespace TFL.Application.Services;

public class DraftService(
    IDraftRepository draftRepository,
    IPlayerRepository playerRepository,
    TeamBalancingService teamBalancingService)
{
    public async Task<DraftDto> GetAsync()
    {
        var draft = await draftRepository.GetAsync();
        return MapToDto(draft);
    }

    public async Task<DraftDto> SaveAsync(SaveDraftRequest request)
    {
        var draft = new Draft
        {
            Id = 1,
            LastModified = DateTime.UtcNow,
            DraftPlayers = request.PlayerIds
                .Select((id, i) => new DraftPlayer { PlayerId = id, SortOrder = i, DraftId = 1 })
                .ToList()
        };

        var saved = await draftRepository.SaveAsync(draft);
        return MapToDto(saved);
    }

    public async Task<List<TeamCombinationDto>> GenerateTeamsAsync(GenerateTeamsRequest request)
    {
        return await teamBalancingService.GenerateCombinationsAsync(
            request.PlayerIds,
            request.AffinityOverrides);
    }

    private static DraftDto MapToDto(Draft draft) => new(
        draft.DraftPlayers.OrderBy(dp => dp.SortOrder).Select(dp => dp.PlayerId).ToList(),
        draft.LastModified);
}
