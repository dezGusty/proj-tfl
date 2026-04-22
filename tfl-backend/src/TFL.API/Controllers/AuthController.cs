using Microsoft.AspNetCore.Mvc;
using TFL.Application.Services;

namespace TFL.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    AuthService authService,
    IConfiguration configuration) : ControllerBase
{
    [HttpGet("google")]
    public IActionResult Google()
    {
        var state = AuthService.GenerateStateNonce();
        var clientId = configuration["Google:ClientId"]!;
        var redirectUri = configuration["Google:RedirectUri"]!;
        var url = authService.GenerateAuthorizationUrl(clientId, redirectUri, state);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            MaxAge = TimeSpan.FromMinutes(5)
        };
        Response.Cookies.Append("tfl_oauth_state", state, cookieOptions);

        return Redirect(url);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
    {
        var storedState = Request.Cookies["tfl_oauth_state"];
        if (storedState != state)
            return Redirect("/signin?error=invalid_state");

        Response.Cookies.Delete("tfl_oauth_state");

        var clientId = configuration["Google:ClientId"]!;
        var clientSecret = configuration["Google:ClientSecret"]!;
        var redirectUri = configuration["Google:RedirectUri"]!;

        var idToken = await authService.ExchangeCodeForTokenAsync(code, clientId, clientSecret, redirectUri);
        if (idToken is null)
            return Redirect("/signin?error=token_exchange_failed");

        var user = await authService.UpsertUserFromIdTokenAsync(idToken);
        if (user is null)
            return Redirect("/signin?error=user_upsert_failed");

        var jwt = authService.IssueJwt(
            user,
            configuration["Jwt:Secret"]!,
            configuration["Jwt:Issuer"]!,
            configuration["Jwt:Audience"]!,
            int.Parse(configuration["Jwt:ExpiryHours"] ?? "8"));

        return Redirect($"/?token={jwt}");
    }
}
