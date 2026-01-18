using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ShiftGiving.Data;

namespace ShiftGiving.Tests;

public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            RemoveDbContextServices(services);
            AddTestDbContext(services);
        });

        builder.UseEnvironment("Testing");
    }

    private static void RemoveDbContextServices(IServiceCollection services)
    {
        var descriptorsToRemove = services
            .Where(d => d.ServiceType == typeof(DbContextOptions<ShiftGivingDbContext>) ||
                       d.ServiceType == typeof(DbContextOptions) ||
                       d.ServiceType == typeof(ShiftGivingDbContext) ||
                       d.ServiceType.FullName?.Contains("Npgsql") == true ||
                       d.ImplementationType?.FullName?.Contains("Npgsql") == true)
            .ToList();

        foreach (var descriptor in descriptorsToRemove)
        {
            services.Remove(descriptor);
        }
    }

    private static void AddTestDbContext(IServiceCollection services)
    {
        var dbName = $"TestDb_{Guid.NewGuid()}";
        services.AddDbContext<ShiftGivingDbContext>(options =>
        {
            options.UseInMemoryDatabase(dbName);
            options.EnableSensitiveDataLogging();
        });
    }
}
