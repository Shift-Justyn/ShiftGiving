namespace ShiftGiving.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplicationBuilder ConfigureProductionUrls(this WebApplicationBuilder builder)
    {
        if (builder.Environment.IsProduction() && string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_URLS")))
            builder.WebHost.UseUrls("http://*:80");
        return builder;
    }
}
