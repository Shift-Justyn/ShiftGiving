namespace ShiftGiving.DTOs;

public class EnhanceTextRequest
{
    public string Text { get; set; } = string.Empty;
    public string Field { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
}

public class EnhanceTextResponse
{
    public string Text { get; set; } = string.Empty;
    public string OriginalText { get; set; } = string.Empty;
}

public class GenerateDescriptionRequest
{
    public string Context { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int? MaxLength { get; set; }
}

public class GenerateDescriptionResponse
{
    public string Description { get; set; } = string.Empty;
}

public class GenerateTitleRequest
{
    public string Context { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int? Count { get; set; }
}

public class GenerateTitleResponse
{
    public List<string> Titles { get; set; } = new();
}
