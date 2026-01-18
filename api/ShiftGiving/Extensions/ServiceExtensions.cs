using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ShiftGiving.Data;
using ShiftGiving.Services;

namespace ShiftGiving.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        if (environment.EnvironmentName == "Testing")
            return services;

        services.AddDbContext<ShiftGivingDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
        return services;
    }

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<AuthService>();
        services.AddScoped<CampaignService>();
        services.AddScoped<OrganizationService>();
        services.AddScoped<DonationService>();
        services.AddScoped<IPaymentService, StripePaymentService>();
        return services;
    }

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSecret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT secret not configured");
        var jwtIssuer = configuration["Jwt:Issuer"];
        var jwtAudience = configuration["Jwt:Audience"];

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => ConfigureJwtBearer(options, jwtSecret, jwtIssuer, jwtAudience));

        services.AddAuthorization();
        return services;
    }

    private static void ConfigureJwtBearer(JwtBearerOptions options, string secret, string? issuer, string? audience)
    {
        options.TokenValidationParameters = CreateTokenValidationParameters(secret, issuer, audience);
    }

    private static TokenValidationParameters CreateTokenValidationParameters(string secret, string? issuer, string? audience)
    {
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        return new TokenValidationParameters
        {
            ValidateIssuer = true, ValidateAudience = true, ValidateLifetime = true,
            ValidateIssuerSigningKey = true, ValidIssuer = issuer, ValidAudience = audience,
            IssuerSigningKey = signingKey
        };
    }

    public static IServiceCollection AddHealthChecksWithDatabase(this IServiceCollection services)
    {
        services.AddHealthChecks().AddDbContextCheck<ShiftGivingDbContext>();
        return services;
    }
}
