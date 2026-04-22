using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TFL.Application.DTOs;
using TFL.Application.Services;

namespace TFL.API.Controllers;

[ApiController]
[Route("api/settings")]
[Authorize(Policy = "Admin")]
public class SettingsController(SettingsService settingsService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get() =>
        Ok(await settingsService.GetAsync());

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] AppSettingsDto request) =>
        Ok(await settingsService.UpdateAsync(request));
}
