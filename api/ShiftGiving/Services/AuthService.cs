using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ShiftGiving.Models;

namespace ShiftGiving.Services;

public class AuthService
{
    private readonly IConfiguration _configuration;

    public AuthService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }

    public string GenerateToken(User user)
    {
        var claims = CreateClaims(user);
        var key = GetSecurityKey();
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = CreateJwtToken(claims, credentials);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var generator = RandomNumberGenerator.Create();
        generator.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    private List<Claim> CreateClaims(User user)
    {
        return new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.UserType.ToString())
        };
    }

    private SymmetricSecurityKey GetSecurityKey()
    {
        var secret = _configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT secret not configured");
        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
    }

    private JwtSecurityToken CreateJwtToken(List<Claim> claims, SigningCredentials credentials)
    {
        return new JwtSecurityToken(
            GetJwtIssuer(),
            GetJwtAudience(),
            claims,
            expires: GetTokenExpiration(),
            signingCredentials: credentials
        );
    }

    private string GetJwtIssuer() => _configuration["Jwt:Issuer"] ?? string.Empty;

    private string GetJwtAudience() => _configuration["Jwt:Audience"] ?? string.Empty;

    private DateTime GetTokenExpiration() => DateTime.UtcNow.AddHours(24);
}
