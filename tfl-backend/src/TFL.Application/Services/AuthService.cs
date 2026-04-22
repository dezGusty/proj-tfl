using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;
using TFL.Application.Interfaces.Repositories;
using TFL.Domain.Entities;
using TFL.Domain.Enums;

namespace TFL.Application.Services;

public class AuthService(
    IAppUserRepository userRepository,
    IHttpClientFactory httpClientFactory)
{
    public string GenerateAuthorizationUrl(string clientId, string redirectUri, string state)
    {
        var scopes = Uri.EscapeDataString("openid email profile");
        return $"https://accounts.google.com/o/oauth2/v2/auth" +
               $"?client_id={Uri.EscapeDataString(clientId)}" +
               $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
               $"&response_type=code" +
               $"&scope={scopes}" +
               $"&state={Uri.EscapeDataString(state)}" +
               $"&access_type=offline";
    }

    public static string GenerateStateNonce()
    {
        var bytes = new byte[32];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToBase64String(bytes);
    }

    public async Task<string?> ExchangeCodeForTokenAsync(
        string code, string clientId, string clientSecret, string redirectUri)
    {
        var client = httpClientFactory.CreateClient();
        var response = await client.PostAsync("https://oauth2.googleapis.com/token",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["code"] = code,
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret,
                ["redirect_uri"] = redirectUri,
                ["grant_type"] = "authorization_code"
            }));

        if (!response.IsSuccessStatusCode) return null;

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        return doc.RootElement.TryGetProperty("id_token", out var idToken)
            ? idToken.GetString()
            : null;
    }

    public async Task<AppUser?> UpsertUserFromIdTokenAsync(string idToken)
    {
        // Parse the JWT payload (we trust Google's signature for MVP; production should validate)
        var parts = idToken.Split('.');
        if (parts.Length < 2) return null;

        var payload = parts[1];
        // Pad base64
        var padded = payload.PadRight(payload.Length + (4 - payload.Length % 4) % 4, '=');
        var bytes = Convert.FromBase64String(padded.Replace('-', '+').Replace('_', '/'));
        using var doc = JsonDocument.Parse(bytes);
        var root = doc.RootElement;

        var sub = root.TryGetProperty("sub", out var subProp) ? subProp.GetString() : null;
        var email = root.TryGetProperty("email", out var emailProp) ? emailProp.GetString() : null;
        var photoUrl = root.TryGetProperty("picture", out var picProp) ? picProp.GetString() : null;

        if (sub is null || email is null) return null;

        var existing = await userRepository.GetByEmailAsync(email);
        if (existing is not null)
        {
            existing.PhotoUrl = photoUrl;
            return await userRepository.UpdateAsync(existing);
        }

        var newUser = new AppUser
        {
            Id = sub,
            Email = email,
            PhotoUrl = photoUrl,
            Roles = UserRole.Standard,
            Approved = false,
            IsActive = true
        };
        return await userRepository.UpsertAsync(newUser);
    }

    public string IssueJwt(AppUser user, string secret, string issuer, string audience, int expiryHours)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new("email", user.Email),
            new("approved", user.Approved.ToString().ToLowerInvariant())
        };

        foreach (var role in UserService.RolesToStrings(user.Roles))
            claims.Add(new Claim("roles", role));

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expiryHours),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
