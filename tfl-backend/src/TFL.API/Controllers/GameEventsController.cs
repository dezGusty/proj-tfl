using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TFL.Application.DTOs;
using TFL.Application.Services;

namespace TFL.API.Controllers;

[ApiController]
[Route("api/game-events")]
[Authorize(Policy = "Standard")]
public class GameEventsController(
    GameEventService gameEventService,
    UserService userService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await gameEventService.GetAllActiveAsync());

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary() =>
        Ok(await gameEventService.GetSummaryAsync());

    [HttpGet("{name}")]
    public async Task<IActionResult> GetByName(string name)
    {
        var evt = await gameEventService.GetByNameAsync(name);
        return evt is null ? NotFound() : Ok(evt);
    }

    [HttpPost]
    [Authorize(Policy = "Organizer")]
    public async Task<IActionResult> Create([FromBody] CreateGameEventRequest request)
    {
        var evt = await gameEventService.CreateAsync(request);
        return CreatedAtAction(nameof(GetByName), new { name = evt.Name }, evt);
    }

    [HttpPut("{name}")]
    [Authorize(Policy = "Organizer")]
    public async Task<IActionResult> Update(string name, [FromBody] UpdateGameEventRequest request)
    {
        var evt = await gameEventService.UpdateAsync(name, request);
        return evt is null ? NotFound() : Ok(evt);
    }

    [HttpPost("{name}/join")]
    public async Task<IActionResult> Join(string name)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (userId is null) return Unauthorized();

        var user = await userService.GetByIdAsync(userId);
        if (user?.LinkedPlayerId is null)
            return UnprocessableEntity(new ProblemDetails { Title = "User is not linked to a player." });

        var result = await gameEventService.JoinAsync(name, user.LinkedPlayerId.Value);
        if (!result)
            return Conflict(new ProblemDetails { Title = "Already registered or event is inactive." });

        return NoContent();
    }

    [HttpDelete("{name}/join")]
    public async Task<IActionResult> Leave(string name)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (userId is null) return Unauthorized();

        var user = await userService.GetByIdAsync(userId);
        if (user?.LinkedPlayerId is null)
            return UnprocessableEntity(new ProblemDetails { Title = "User is not linked to a player." });

        var result = await gameEventService.LeaveAsync(name, user.LinkedPlayerId.Value);
        if (!result)
            return UnprocessableEntity(new ProblemDetails { Title = "Not registered for this event." });

        return NoContent();
    }

    [HttpPost("{name}/transfer-to-draft")]
    [Authorize(Policy = "Organizer")]
    public async Task<IActionResult> TransferToDraft(string name)
    {
        try
        {
            var draft = await gameEventService.TransferToDraftAsync(name);
            return Ok(draft);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new ProblemDetails { Title = ex.Message });
        }
    }
}
