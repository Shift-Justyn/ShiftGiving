using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ShiftGiving.Models;

namespace ShiftGiving.Tests;

public static class TestAuthHelper
{
    public static string GenerateTestToken(Guid userId)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Email, "test@example.com"),
            new(ClaimTypes.Role, UserType.Individual.ToString())
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("TestSecretKeyForJWTTokenGenerationThatIsAtLeast32Chars"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: "ShiftGiving.Test",
            audience: "ShiftGiving.Test",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static HttpClient CreateAuthenticatedClient(HttpClient client, Guid userId)
    {
        var token = GenerateTestToken(userId);
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        return client;
    }
}
