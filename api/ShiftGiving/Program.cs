var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHealthChecks();
builder.WebHost.UseUrls("http://*:80");
var app = builder.Build();

app.MapGet("/", () => "Hello World!");
app.MapHealthChecks("/health");

app.Run();
