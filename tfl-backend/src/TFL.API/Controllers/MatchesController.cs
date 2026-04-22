using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TFL.Application.DTOs;
using TFL.Application.Interfaces.Repositories;
using TFL.Application.Services;

namespace TFL.API.Controllers;

[ApiController]
[Route("api/matches")]
[Authorize(Policy = "Standard")]
public class MatchesController(
    MatchService matchService,
    IAppSettingsRepository settingsRepository) : ControllerBase
{
    [HttpGet("recent")]
    public async Task<IActionResult> GetRecent()
    {
        var settings = await settingsRepository.GetAsync();
        return Ok(await matchService.GetRecentAsync(settings.RecentMatchesToStore));
    }

    [HttpGet("{dateKey}")]
    public async Task<IActionResult> GetByDateKey(string dateKey)
    {
        var match = await matchService.GetByDateKeyAsync(dateKey);
        return match is null ? NotFound() : Ok(match);
    }

    [HttpPost]
    [Authorize(Policy = "Organizer")]
    public async Task<IActionResult> Create([FromBody] CreateMatchRequest request)
    {
        var match = await matchService.CreateAsync(request);
        return CreatedAtAction(nameof(GetByDateKey), new { dateKey = match.DateKey }, match);
    }

    [HttpPut("{dateKey}")]
    [Authorize(Policy = "Organizer")]
    public async Task<IActionResult> Update(string dateKey, [FromBody] UpdateMatchRequest request)
    {
        var match = await matchService.UpdateAsync(dateKey, request);
        return match is null ? NotFound() : Ok(match);
    }
}
