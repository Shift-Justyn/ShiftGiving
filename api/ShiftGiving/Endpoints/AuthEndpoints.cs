using Microsoft.EntityFrameworkCore;
using ShiftGiving.Data;
using ShiftGiving.DTOs;
using ShiftGiving.Models;
using ShiftGiving.Services;

namespace ShiftGiving.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        app.MapPost("/api/auth/register", HandleRegister);
        app.MapPost("/api/auth/login", HandleLogin);
        app.MapPost("/api/auth/refresh", HandleRefresh);
        app.MapPost("/api/auth/forgot-password", HandleForgotPassword);
    }

    private static async Task<IResult> HandleRegister(RegisterRequest request, ShiftGivingDbContext db, AuthService authService)
    {
        var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existingUser != null)
            return Results.BadRequest(ApiResponse<AuthResponse>.ErrorResponse("CONFLICT", "Email already registered"));

        var user = CreateUser(request, authService);
        db.Users.Add(user);
        await db.SaveChangesAsync();

        return CreateRegistrationResponse(user, authService);
    }

    private static User CreateUser(RegisterRequest request, AuthService authService)
    {
        var now = DateTime.UtcNow;
        var userType = Enum.Parse<UserType>(request.UserType, true);
        var passwordHash = authService.HashPassword(request.Password);

        return new User
        {
            Id = Guid.NewGuid(), Email = request.Email, PasswordHash = passwordHash,
            FirstName = request.FirstName, LastName = request.LastName, DateOfBirth = request.DateOfBirth,
            UserType = userType, CreatedAt = now, UpdatedAt = now
        };
    }

    private static IResult CreateRegistrationResponse(User user, AuthService authService)
    {
        var token = authService.GenerateToken(user);
        var userDto = new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.UserType.ToString(), user.AvatarUrl);
        var authResponse = new AuthResponse(userDto, token);
        return Results.Created($"/api/users/{user.Id}", ApiResponse<AuthResponse>.SuccessResponse(authResponse));
    }

    private static async Task<IResult> HandleLogin(LoginRequest request, ShiftGivingDbContext db, AuthService authService)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null || !authService.VerifyPassword(request.Password, user.PasswordHash))
            return Results.Unauthorized();

        return CreateLoginResponse(user, authService);
    }

    private static IResult CreateLoginResponse(User user, AuthService authService)
    {
        var token = authService.GenerateToken(user);
        var refreshToken = authService.GenerateRefreshToken();
        var userDto = new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.UserType.ToString(), user.AvatarUrl);
        var authResponse = new AuthResponse(userDto, token, refreshToken);
        return Results.Ok(ApiResponse<AuthResponse>.SuccessResponse(authResponse));
    }

    private static Task<IResult> HandleRefresh(RefreshTokenRequest request, ShiftGivingDbContext db, AuthService authService)
    {
        var newToken = authService.GenerateRefreshToken();
        var newRefreshToken = authService.GenerateRefreshToken();
        var tokenResponse = new { token = newToken, refreshToken = newRefreshToken };
        return Task.FromResult(Results.Ok(ApiResponse<object>.SuccessResponse(tokenResponse)));
    }

    private static async Task<IResult> HandleForgotPassword(ForgotPasswordRequest request, ShiftGivingDbContext db)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        var message = new { message = "Password reset email sent" };
        return Results.Ok(ApiResponse<object>.SuccessResponse(message));
    }
}
