using ShiftGiving.Data;

namespace ShiftGiving.Endpoints;

public static class HealthEndpoints
{
    public static void MapHealthEndpoints(this WebApplication app)
    {
        app.MapGet("/", () => "Hello World!");
        app.MapGet("/health", HandleHealthCheck);
    }

    private static async Task<IResult> HandleHealthCheck(ShiftGivingDbContext db)
    {
        var canConnect = await db.Database.CanConnectAsync();
        var response = CreateHealthResponse(canConnect);
        var statusCode = canConnect ? 200 : 503;
        return Results.Json(response, statusCode: statusCode);
    }

    private static object CreateHealthResponse(bool canConnect)
    {
        return new
        {
            status = canConnect ? "healthy" : "unhealthy",
            timestamp = DateTime.UtcNow,
            database = canConnect ? "connected" : "disconnected"
        };
    }
}
