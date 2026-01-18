using System.Net;
using System.Net.Http.Json;
using ShiftGiving.DTOs;

namespace ShiftGiving.Tests;

[Trait("Category", "Integration")]
public class AuthEndpointsTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public AuthEndpointsTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsCreatedStatus()
    {
        var client = _factory.CreateClient();
        var request = CreateValidRegisterRequest();
        var response = await client.PostAsJsonAsync("/api/auth/register", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsAuthResponse()
    {
        var client = _factory.CreateClient();
        var request = CreateValidRegisterRequest();
        var response = await client.PostAsJsonAsync("/api/auth/register", request);
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<AuthResponse>>();

        Assert.NotNull(result);
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsToken()
    {
        var client = _factory.CreateClient();
        var request = CreateValidRegisterRequest();
        var response = await client.PostAsJsonAsync("/api/auth/register", request);
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<AuthResponse>>();

        Assert.NotNull(result!.Data!.Token);
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsUserData()
    {
        var client = _factory.CreateClient();
        var request = CreateValidRegisterRequest();
        var response = await client.PostAsJsonAsync("/api/auth/register", request);
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<AuthResponse>>();

        Assert.Equal(request.Email, result!.Data!.User.Email);
    }

    [Fact]
    public async Task Register_WithDuplicateEmail_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();
        var request = CreateValidRegisterRequest();

        await client.PostAsJsonAsync("/api/auth/register", request);
        var response = await client.PostAsJsonAsync("/api/auth/register", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsSuccess()
    {
        var client = _factory.CreateClient();
        var registerRequest = CreateValidRegisterRequest();
        await client.PostAsJsonAsync("/api/auth/register", registerRequest);

        var loginRequest = new LoginRequest(registerRequest.Email, registerRequest.Password);
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsToken()
    {
        var client = _factory.CreateClient();
        var registerRequest = CreateValidRegisterRequest();
        await client.PostAsJsonAsync("/api/auth/register", registerRequest);

        var loginRequest = new LoginRequest(registerRequest.Email, registerRequest.Password);
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<AuthResponse>>();

        Assert.NotNull(result!.Data!.Token);
    }

    [Fact]
    public async Task Login_WithInvalidEmail_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();
        var loginRequest = new LoginRequest("nonexistent@example.com", "password123");
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithWrongPassword_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();
        var registerRequest = CreateValidRegisterRequest();
        await client.PostAsJsonAsync("/api/auth/register", registerRequest);

        var loginRequest = new LoginRequest(registerRequest.Email, "wrongpassword");
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Refresh_WithValidToken_ReturnsNewTokens()
    {
        var client = _factory.CreateClient();
        var registerRequest = CreateValidRegisterRequest();
        await client.PostAsJsonAsync("/api/auth/register", registerRequest);

        var loginRequest = new LoginRequest(registerRequest.Email, registerRequest.Password);
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var loginResult = await loginResponse.Content.ReadFromJsonAsync<ApiResponse<AuthResponse>>();

        var refreshRequest = new RefreshTokenRequest(loginResult!.Data!.RefreshToken!);
        var response = await client.PostAsJsonAsync("/api/auth/refresh", refreshRequest);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task ForgotPassword_WithValidEmail_ReturnsSuccess()
    {
        var client = _factory.CreateClient();
        var request = new ForgotPasswordRequest("user@example.com");
        var response = await client.PostAsJsonAsync("/api/auth/forgot-password", request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private RegisterRequest CreateValidRegisterRequest()
    {
        return new RegisterRequest(
            $"user{Guid.NewGuid()}@example.com",
            "Password123!",
            "John",
            "Doe",
            DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-25)),
            "Individual"
        );
    }
}
