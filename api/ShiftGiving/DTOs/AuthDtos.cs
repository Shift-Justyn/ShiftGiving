namespace ShiftGiving.DTOs;

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    DateOnly DateOfBirth,
    string UserType
);

public record LoginRequest(
    string Email,
    string Password
);

public record RefreshTokenRequest(
    string RefreshToken
);

public record ForgotPasswordRequest(
    string Email
);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string UserType,
    string? AvatarUrl = null
);

public record AuthResponse(
    UserDto User,
    string Token,
    string? RefreshToken = null
);
