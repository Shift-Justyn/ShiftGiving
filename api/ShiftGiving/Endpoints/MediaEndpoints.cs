using System.Security.Claims;
using ShiftGiving.DTOs;
using ShiftGiving.Services;

namespace ShiftGiving.Endpoints;

public static class MediaEndpoints
{
    public static void MapMediaEndpoints(this WebApplication app)
    {
        app.MapPost("/api/media/upload", HandleUploadMedia).RequireAuthorization();
        app.MapGet("/api/media/{id:guid}", HandleGetMedia);
        app.MapDelete("/api/media/{id:guid}", HandleDeleteMedia).RequireAuthorization();
        app.MapPost("/api/media/upload-url", HandleGeneratePresignedUrl).RequireAuthorization();
    }

    private static async Task<IResult> HandleUploadMedia(
        HttpContext httpContext,
        IFormFile file,
        MediaService mediaService)
    {
        var userId = ExtractUserIdFromClaims(httpContext);
        if (userId == Guid.Empty)
            return Results.Unauthorized();

        if (file == null || file.Length == 0)
            return Results.BadRequest(ApiResponse<MediaAssetResponse>.ErrorResponse("INVALID_FILE", "File is required"));

        var mediaAsset = await mediaService.UploadMediaAsync(file, userId);
        return Results.Created($"/api/media/{mediaAsset.Id}", ApiResponse<MediaAssetResponse>.SuccessResponse(mediaAsset));
    }

    private static async Task<IResult> HandleGetMedia(Guid id, MediaService mediaService)
    {
        var filePath = await mediaService.GetMediaUrlAsync(id);
        var fileExtension = Path.GetExtension(filePath).ToLower();
        var contentType = GetContentType(fileExtension);

        return Results.File(filePath, contentType);
    }

    private static async Task<IResult> HandleDeleteMedia(
        Guid id,
        HttpContext httpContext,
        MediaService mediaService)
    {
        var userId = ExtractUserIdFromClaims(httpContext);
        if (userId == Guid.Empty)
            return Results.Unauthorized();

        await mediaService.DeleteMediaAsync(id, userId);
        return Results.Ok(ApiResponse<object>.SuccessResponse(new { message = "Media deleted successfully" }));
    }

    private static async Task<IResult> HandleGeneratePresignedUrl(
        HttpContext httpContext,
        MediaService mediaService)
    {
        var userId = ExtractUserIdFromClaims(httpContext);
        if (userId == Guid.Empty)
            return Results.Unauthorized();

        var presignedUrl = await mediaService.GeneratePresignedUrlAsync(userId);
        return Results.Ok(ApiResponse<PresignedUrlResponse>.SuccessResponse(presignedUrl));
    }

    private static Guid ExtractUserIdFromClaims(HttpContext httpContext)
    {
        var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    private static string GetContentType(string fileExtension)
    {
        return fileExtension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".mp4" => "video/mp4",
            ".webm" => "video/webm",
            _ => "application/octet-stream"
        };
    }
}
