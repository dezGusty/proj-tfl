using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TFL.Application.DTOs;
using TFL.Application.Services;

namespace TFL.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Policy = "Admin")]
public class UsersController(UserService userService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await userService.GetAllAsync());

    [HttpPut("{id}/approve")]
    public async Task<IActionResult> Approve(string id, [FromBody] ApproveUserRequest request)
    {
        var user = await userService.ApproveAsync(id, request.Approved);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPut("{id}/roles")]
    public async Task<IActionResult> UpdateRoles(string id, [FromBody] UpdateRolesRequest request)
    {
        var (user, error) = await userService.UpdateRolesAsync(id, request.Roles);
        if (user is null && error is null) return NotFound();
        if (error is not null) return BadRequest(new ProblemDetails { Title = error });
        return Ok(user);
    }

    [HttpPut("{id}/deactivate")]
    public async Task<IActionResult> Deactivate(string id)
    {
        var user = await userService.DeactivateAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPut("{id}/link-player")]
    public async Task<IActionResult> LinkPlayer(string id, [FromBody] LinkPlayerRequest request)
    {
        var (user, error) = await userService.LinkPlayerAsync(id, request.PlayerId);
        if (user is null && error is null) return NotFound();
        if (error is not null) return Conflict(new ProblemDetails { Title = error });
        return Ok(user);
    }
}
