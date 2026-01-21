namespace ShiftGiving.DTOs;

public class MediaAssetResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = "image";
    public string? Size { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UploadMediaRequest
{
    public IFormFile File { get; set; } = null!;
}

public class GenerateImageRequest
{
    public string Prompt { get; set; } = string.Empty;
    public string Style { get; set; } = string.Empty;
}

public class PresignedUrlResponse
{
    public string UploadUrl { get; set; } = string.Empty;
    public string MediaId { get; set; } = string.Empty;
    public Dictionary<string, string>? FormFields { get; set; }
}
