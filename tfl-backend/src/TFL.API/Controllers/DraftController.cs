using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TFL.Application.DTOs;
using TFL.Application.Services;

namespace TFL.API.Controllers;

[ApiController]
[Route("api/draft")]
[Authorize(Policy = "Standard")]
public class DraftController(DraftService draftService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get() =>
        Ok(await draftService.GetAsync());

    [HttpPut]
    [Authorize(Policy = "Organizer")]
    public async Task<IActionResult> Save([FromBody] SaveDraftRequest request) =>
        Ok(await draftService.SaveAsync(request));

    [HttpPost("generate-teams")]
    public async Task<IActionResult> GenerateTeams([FromBody] GenerateTeamsRequest request)
    {
        if (request.PlayerIds.Count < 2)
            return BadRequest(new ProblemDetails { Title = "At least 2 players required." });

        var result = await draftService.GenerateTeamsAsync(request);
        return Ok(result);
    }
}
