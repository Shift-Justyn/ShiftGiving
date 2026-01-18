using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using ShiftGiving.Models;
using ShiftGiving.Services;

namespace ShiftGiving.Tests.Services;

[Trait("Category", "Unit")]
public class AuthServiceTests
{
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        var configuration = CreateTestConfiguration();
        _authService = new AuthService(configuration);
    }

    [Fact]
    public void HashPassword_ReturnsNonNullString()
    {
        var hash = _authService.HashPassword("password123");

        Assert.NotNull(hash);
    }

    [Fact]
    public void HashPassword_ReturnsDifferentHashEachTime()
    {
        var hash1 = _authService.HashPassword("password123");
        var hash2 = _authService.HashPassword("password123");

        Assert.NotEqual(hash1, hash2);
    }

    [Fact]
    public void VerifyPassword_WithCorrectPassword_ReturnsTrue()
    {
        var password = "password123";
        var hash = _authService.HashPassword(password);

        var result = _authService.VerifyPassword(password, hash);

        Assert.True(result);
    }

    [Fact]
    public void VerifyPassword_WithWrongPassword_ReturnsFalse()
    {
        var hash = _authService.HashPassword("password123");

        var result = _authService.VerifyPassword("wrongpassword", hash);

        Assert.False(result);
    }

    [Fact]
    public void GenerateToken_ReturnsNonNullString()
    {
        var user = CreateTestUser();

        var token = _authService.GenerateToken(user);

        Assert.NotNull(token);
    }

    [Fact]
    public void GenerateToken_ContainsUserClaims()
    {
        var user = CreateTestUser();

        var token = _authService.GenerateToken(user);
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);
        var claims = jwtToken.Claims.ToList();

        Assert.Contains(claims, c => c.Type == ClaimTypes.NameIdentifier && c.Value == user.Id.ToString());
    }

    [Fact]
    public void GenerateRefreshToken_ReturnsNonNullString()
    {
        var token = _authService.GenerateRefreshToken();

        Assert.NotNull(token);
    }

    [Fact]
    public void GenerateRefreshToken_ReturnsUniqueValues()
    {
        var token1 = _authService.GenerateRefreshToken();
        var token2 = _authService.GenerateRefreshToken();

        Assert.NotEqual(token1, token2);
    }

    private IConfiguration CreateTestConfiguration()
    {
        var inMemorySettings = new Dictionary<string, string>
        {
            {"Jwt:Secret", "your-super-secret-key-that-is-at-least-32-characters-long"},
            {"Jwt:Issuer", "ShiftGiving"},
            {"Jwt:Audience", "ShiftGiving"}
        };

        return new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();
    }

    private User CreateTestUser()
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Email = "test@example.com",
            FirstName = "Test",
            LastName = "User",
            UserType = UserType.Individual,
            PasswordHash = "hashedpassword",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
