using ShiftGiving.DTOs;

namespace ShiftGiving.Endpoints;

public static class AIEndpoints
{
    public static void MapAIEndpoints(this WebApplication app)
    {
        app.MapPost("/api/ai/enhance-text", HandleEnhanceText);
        app.MapPost("/api/ai/generate-description", HandleGenerateDescription);
        app.MapPost("/api/ai/generate-title", HandleGenerateTitle);
    }

    private static Task<IResult> HandleEnhanceText(EnhanceTextRequest request)
    {
        var enhancedText = EnhanceTextContent(request.Text, request.Action);
        var response = new EnhanceTextResponse
        {
            Text = enhancedText,
            OriginalText = request.Text
        };
        return Task.FromResult(Results.Ok(ApiResponse<EnhanceTextResponse>.SuccessResponse(response)));
    }

    private static Task<IResult> HandleGenerateDescription(GenerateDescriptionRequest request)
    {
        var maxLength = request.MaxLength ?? 200;
        var description = GenerateMockDescription(request.Context, request.Category, maxLength);
        var response = new GenerateDescriptionResponse { Description = description };
        return Task.FromResult(Results.Ok(ApiResponse<GenerateDescriptionResponse>.SuccessResponse(response)));
    }

    private static Task<IResult> HandleGenerateTitle(GenerateTitleRequest request)
    {
        var count = request.Count ?? 3;
        var titles = GenerateMockTitles(request.Context, request.Category, count);
        var response = new GenerateTitleResponse { Titles = titles };
        return Task.FromResult(Results.Ok(ApiResponse<GenerateTitleResponse>.SuccessResponse(response)));
    }

    private static string EnhanceTextContent(string text, string action)
    {
        return action switch
        {
            "fix_grammar" => $"{text}.",
            "improve" => $"{text}. Enhanced for clarity and impact.",
            "rewrite" => $"This initiative aims to make a meaningful difference. {text}",
            "tone" => $"{text}. Together, we can create change.",
            "expand" => $"{text}. Our goal is to address critical community needs and support those in our organization. Every contribution helps us move closer to making a lasting impact.",
            _ => text
        };
    }

    private static string GenerateMockDescription(string context, string? category, int maxLength)
    {
        var baseDescription = $"Support {context.ToLowerInvariant()} initiatives";
        if (category != null)
        {
            baseDescription = $"Join our {category} campaign: {baseDescription}";
        }

        return baseDescription.Length <= maxLength
            ? baseDescription
            : baseDescription[..maxLength];
    }

    private static List<string> GenerateMockTitles(string context, string? category, int count)
    {
        var titles = new List<string>();
        var contextWords = context.Split(' ');
        var categoryPrefix = category != null ? $"{category} " : "";

        titles.Add($"Make a Difference: {categoryPrefix}{contextWords[0]}");
        if (count > 1)
            titles.Add($"Support {categoryPrefix}{context}");
        if (count > 2)
            titles.Add($"Help Us {categoryPrefix}Transform Lives");
        if (count > 3)
            titles.Add($"Join the {categoryPrefix}Movement");

        return titles.Take(count).ToList();
    }
}
