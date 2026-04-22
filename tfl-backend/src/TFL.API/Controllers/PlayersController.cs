using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TFL.Application.DTOs;
using TFL.Application.Services;

namespace TFL.API.Controllers;

[ApiController]
[Route("api/players")]
[Authorize(Policy = "Standard")]
public class PlayersController(PlayerService playerService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await playerService.GetAllActiveAsync());

    [HttpGet("archived")]
    public async Task<IActionResult> GetArchived() =>
        Ok(await playerService.GetAllArchivedAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var player = await playerService.GetByIdAsync(id);
        return player is null ? NotFound() : Ok(player);
    }

    [HttpPost]
    [Authorize(Policy = "Organizer")]
    public async Task<IActionResult> Create([FromBody] CreatePlayerRequest request)
    {
        var player = await playerService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = player.Id }, player);
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "Organizer")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePlayerRequest request)
    {
        var player = await playerService.UpdateAsync(id, request);
        return player is null ? NotFound() : Ok(player);
    }

    [HttpPatch("{id:int}/archive")]
    [Authorize(Policy = "Organizer")]
    public async Task<IActionResult> Archive(int id, [FromBody] ArchivePlayerRequest request)
    {
        var player = await playerService.SetArchivedAsync(id, request.Archived);
        return player is null ? NotFound() : Ok(player);
    }

    [HttpPatch("{id:int}/rating")]
    [Authorize(Policy = "Organizer")]
    public async Task<IActionResult> AdjustRating(int id, [FromBody] RatingAdjustmentRequest request)
    {
        var player = await playerService.ApplyManualRatingAdjustmentAsync(id, request.Adjustment, request.Note);
        return player is null ? NotFound() : Ok(player);
    }
}
