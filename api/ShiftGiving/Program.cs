using ShiftGiving.Data;
using ShiftGiving.Endpoints;
using ShiftGiving.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabase(builder.Configuration, builder.Environment);
builder.Services.AddApplicationServices();
builder.Services.AddJwtAuthentication(builder.Configuration);
if (builder.Environment.EnvironmentName != "Testing")
{
    builder.Services.AddHealthChecksWithDatabase();
}
else
{
    builder.Services.AddHealthChecks();
}
builder.Services.AddCors(options =>
{
    options.AddPolicy("Development", policy =>
    {
        policy.WithOrigins("http://localhost:8080", "http://localhost:3000", "http://localhost:5500")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("https://giving.justyn.app", "https://d1a1mau07wmfww.cloudfront.net")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.ConfigureProductionUrls();

var app = builder.Build();

if (app.Environment.EnvironmentName == "Testing")
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();
    TestDataSeeder.SeedTestData(db);
}

if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "Testing")
{
    app.UseCors("Development");
}
else
{
    app.UseCors("Production");
}

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthEndpoints();
app.MapAuthEndpoints();
app.MapCampaignEndpoints();
app.MapOrganizationEndpoints();
app.MapDonationEndpoints();
app.MapNotificationEndpoints();
app.MapMediaEndpoints();
app.MapAIEndpoints();

app.Run();

public partial class Program { }
