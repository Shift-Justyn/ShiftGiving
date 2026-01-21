using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using ShiftGiving.DTOs;
using ShiftGiving.Services;

namespace ShiftGiving.Endpoints;

public static class DonationEndpoints
{
    public static void MapDonationEndpoints(this WebApplication app)
    {
        app.MapPost("/api/donations", HandleCreateDonation).RequireAuthorization();
        app.MapGet("/api/donations/{id:guid}", HandleGetDonationById);
        app.MapGet("/api/donations/user/{userId:guid}", HandleGetDonationsByUser);
        app.MapGet("/api/donations/campaign/{campaignId:guid}", HandleGetDonationsByCampaign);
        app.MapGet("/api/donations/campaign/{campaignId:guid}/summary", HandleGetDonationSummary);
    }

    private static async Task<IResult> HandleCreateDonation(
        HttpContext httpContext,
        CreateDonationRequest request,
        [FromServices] DonationService donationService)
    {
        var userId = ExtractUserIdFromClaims(httpContext);
        if (userId == Guid.Empty)
            return Results.Unauthorized();
        var donation = await donationService.CreateDonation(userId, request);
        return Results.Created($"/api/donations/{donation.Id}", ApiResponse<DonationResponse>.SuccessResponse(donation));
    }

    private static Guid ExtractUserIdFromClaims(HttpContext httpContext)
    {
        var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    private static async Task<IResult> HandleGetDonationById(Guid id, [FromServices] DonationService donationService)
    {
        var donation = await donationService.GetDonationById(id);
        if (donation == null)
            return Results.NotFound(ApiResponse<DonationResponse>.ErrorResponse("NOT_FOUND", "Donation not found"));
        return Results.Ok(ApiResponse<DonationResponse>.SuccessResponse(donation));
    }

    private static async Task<IResult> HandleGetDonationsByUser(
        Guid userId,
        [FromServices] DonationService donationService,
        int page = 1,
        int pageSize = 20)
    {
        var (donations, totalCount) = await donationService.GetDonationsByUser(userId, page, pageSize);
        var meta = CreatePaginationMeta(page, pageSize, totalCount);
        return Results.Ok(ApiResponse<List<DonationResponse>>.SuccessResponse(donations, meta));
    }

    private static async Task<IResult> HandleGetDonationsByCampaign(
        Guid campaignId,
        [FromServices] DonationService donationService,
        int page = 1,
        int pageSize = 20)
    {
        var (donations, totalCount) = await donationService.GetDonationsByCampaign(campaignId, page, pageSize);
        var meta = CreatePaginationMeta(page, pageSize, totalCount);
        return Results.Ok(ApiResponse<List<DonationResponse>>.SuccessResponse(donations, meta));
    }

    private static async Task<IResult> HandleGetDonationSummary(Guid campaignId, [FromServices] DonationService donationService)
    {
        var summary = await donationService.GetDonationSummaryByCampaign(campaignId);
        return Results.Ok(ApiResponse<DonationSummary>.SuccessResponse(summary));
    }

    private static PaginationMeta CreatePaginationMeta(int page, int pageSize, int totalCount)
    {
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        return new PaginationMeta { Page = page, PageSize = pageSize, TotalCount = totalCount, TotalPages = totalPages };
    }
}
