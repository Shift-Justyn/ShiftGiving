using ShiftGiving.DTOs;
using ShiftGiving.Services;

namespace ShiftGiving.Endpoints;

public static class CampaignEndpoints
{
    public static void MapCampaignEndpoints(this WebApplication app)
    {
        app.MapGet("/api/campaigns", HandleGetCampaigns);
        app.MapGet("/api/campaigns/{id:guid}", HandleGetCampaignById);
    }

    private static async Task<IResult> HandleGetCampaigns(
        CampaignService campaignService,
        int page = 1,
        int pageSize = 20,
        string? status = null,
        Guid? organizationId = null,
        string? search = null,
        bool? featured = null)
    {
        var (campaigns, totalCount) = await campaignService.GetCampaigns(page, pageSize, status, organizationId, search, featured);
        var meta = CreatePaginationMeta(page, pageSize, totalCount);
        return Results.Ok(ApiResponse<List<CampaignListResponse>>.SuccessResponse(campaigns, meta));
    }

    private static PaginationMeta CreatePaginationMeta(int page, int pageSize, int totalCount)
    {
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        return new PaginationMeta { Page = page, PageSize = pageSize, TotalCount = totalCount, TotalPages = totalPages };
    }

    private static async Task<IResult> HandleGetCampaignById(Guid id, CampaignService campaignService)
    {
        var campaign = await campaignService.GetCampaignById(id);
        if (campaign == null)
            return Results.NotFound(ApiResponse<CampaignDetailResponse>.ErrorResponse("NOT_FOUND", "Campaign not found"));
        return Results.Ok(ApiResponse<CampaignDetailResponse>.SuccessResponse(campaign));
    }
}
