using ShiftGiving.DTOs;

namespace ShiftGiving.Services;

public class MediaService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<MediaService> _logger;

    public MediaService(IConfiguration configuration, ILogger<MediaService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<MediaAssetResponse> UploadMediaAsync(IFormFile file, Guid userId)
    {
        ValidateFile(file);

        var fileId = Guid.NewGuid();
        var fileName = $"{fileId}_{file.FileName}";
        var mediaType = DetermineMediaType(file.ContentType);

        await SaveFileAsync(fileName, file);

        _logger.LogInformation($"Media uploaded: {fileName} by user {userId}");

        return new MediaAssetResponse
        {
            Id = fileId,
            Name = file.FileName,
            Url = $"/api/media/{fileId}",
            Type = mediaType,
            Size = FormatFileSize(file.Length),
            CreatedAt = DateTime.UtcNow
        };
    }

    public async Task<PresignedUrlResponse> GeneratePresignedUrlAsync(Guid userId)
    {
        var mediaId = Guid.NewGuid();
        var uploadUrl = $"/api/media/upload-direct/{mediaId}";

        _logger.LogInformation($"Presigned URL generated for user {userId}");

        return new PresignedUrlResponse
        {
            UploadUrl = uploadUrl,
            MediaId = mediaId.ToString()
        };
    }

    public async Task<string> GetMediaUrlAsync(Guid id)
    {
        var filePath = GetMediaFilePath(id.ToString());

        if (!File.Exists(filePath))
            throw new FileNotFoundException("Media not found");

        return filePath;
    }

    public async Task DeleteMediaAsync(Guid id, Guid userId)
    {
        var filePath = GetMediaFilePath(id.ToString());

        if (!File.Exists(filePath))
            throw new FileNotFoundException("Media not found");

        File.Delete(filePath);
        _logger.LogInformation($"Media deleted: {id} by user {userId}");
    }

    private void ValidateFile(IFormFile file)
    {
        const long maxFileSize = 50 * 1024 * 1024;
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".webm" };

        if (file.Length == 0)
            throw new ArgumentException("File is empty");

        if (file.Length > maxFileSize)
            throw new ArgumentException($"File exceeds maximum size of {maxFileSize / 1024 / 1024}MB");

        var extension = Path.GetExtension(file.FileName).ToLower();
        if (!allowedExtensions.Contains(extension))
            throw new ArgumentException($"File type {extension} is not allowed");
    }

    private string DetermineMediaType(string? contentType)
    {
        if (string.IsNullOrEmpty(contentType))
            return "image";

        return contentType.StartsWith("video/") ? "video" : "image";
    }

    private async Task SaveFileAsync(string fileName, IFormFile file)
    {
        var uploadDir = GetUploadDirectory();
        var filePath = Path.Combine(uploadDir, fileName);

        using var stream = file.OpenReadStream();
        using var fileStream = File.Create(filePath);
        await stream.CopyToAsync(fileStream);
    }

    private string GetUploadDirectory()
    {
        var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "media");
        Directory.CreateDirectory(uploadDir);
        return uploadDir;
    }

    private string GetMediaFilePath(string mediaId)
    {
        var uploadDir = GetUploadDirectory();
        var files = Directory.GetFiles(uploadDir, $"{mediaId}_*");
        return files.FirstOrDefault() ?? throw new FileNotFoundException();
    }

    private string FormatFileSize(long bytes)
    {
        const long kb = 1024;
        const long mb = kb * 1024;
        const long gb = mb * 1024;

        return bytes switch
        {
            >= gb => $"{bytes / (double)gb:F2} GB",
            >= mb => $"{bytes / (double)mb:F2} MB",
            >= kb => $"{bytes / (double)kb:F2} KB",
            _ => $"{bytes} B"
        };
    }
}
