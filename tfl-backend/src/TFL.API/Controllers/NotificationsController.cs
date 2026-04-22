using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TFL.Application.DTOs;
using TFL.Application.Services;

namespace TFL.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize(Policy = "Standard")]
public class NotificationsController(NotificationService notificationService) : ControllerBase
{
    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] PushSubscribeRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (userId is null) return Unauthorized();

        await notificationService.SubscribeAsync(userId, request);
        return NoContent();
    }

    [HttpDelete("subscribe")]
    public async Task<IActionResult> Unsubscribe([FromBody] PushUnsubscribeRequest request)
    {
        await notificationService.UnsubscribeAsync(request.Endpoint);
        return NoContent();
    }
}
