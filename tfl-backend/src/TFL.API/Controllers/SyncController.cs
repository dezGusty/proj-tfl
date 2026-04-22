using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TFL.Application.DTOs;
using TFL.Application.Services;
using TFL.Domain.Enums;

namespace TFL.API.Controllers;

[ApiController]
[Route("api/sync")]
[Authorize(Policy = "Admin")]
public class SyncController(SyncService syncService) : ControllerBase
{
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus() =>
        Ok(await syncService.GetStatusAsync());

    [HttpPost]
    public async Task<IActionResult> SyncAll() =>
        Ok(await syncService.SyncAllAsync());

    [HttpPost("{entityType}")]
    public async Task<IActionResult> SyncOne(string entityType)
    {
        var parsed = entityType.ToLowerInvariant() switch
        {
            "players" => (SyncEntityType?)SyncEntityType.Players,
            "matches" => SyncEntityType.Matches,
            "game-events" => SyncEntityType.GameEvents,
            "draft" => SyncEntityType.Draft,
            _ => null
        };

        if (parsed is null)
            return BadRequest(new ProblemDetails { Title = $"Unknown entity type: {entityType}" });

        return Ok(await syncService.SyncEntityTypeAsync(parsed.Value));
    }

    [HttpGet("conflicts")]
    public async Task<IActionResult> GetConflicts() =>
        Ok(await syncService.GetConflictsAsync());

    [HttpPut("conflicts/{id:int}/resolve")]
    public async Task<IActionResult> ResolveConflict(int id, [FromBody] ResolveConflictRequest request)
    {
        if (request.Winner != "sqlite" && request.Winner != "firestore")
            return BadRequest(new ProblemDetails { Title = "Winner must be 'sqlite' or 'firestore'." });

        var success = await syncService.ResolveConflictAsync(id, request.Winner);
        return success ? Ok() : NotFound();
    }
}
