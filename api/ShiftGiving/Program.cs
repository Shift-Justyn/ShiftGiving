using ShiftGiving.Endpoints;
using ShiftGiving.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabase(builder.Configuration, builder.Environment);
builder.Services.AddApplicationServices();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddHealthChecksWithDatabase();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Development", policy =>
    {
        policy.WithOrigins("http://localhost:8080", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.ConfigureProductionUrls();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseCors("Development");
}

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthEndpoints();
app.MapAuthEndpoints();
app.MapCampaignEndpoints();
app.MapOrganizationEndpoints();
app.MapDonationEndpoints();

app.Run();

public partial class Program { }
