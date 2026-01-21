using Microsoft.AspNetCore.Mvc;
using ShiftGiving.DTOs;
using ShiftGiving.Services;

namespace ShiftGiving.Endpoints;

public static class OrganizationEndpoints
{
    public static void MapOrganizationEndpoints(this WebApplication app)
    {
        app.MapGet("/api/organizations", HandleGetOrganizations);
        app.MapGet("/api/organizations/{id:guid}", HandleGetOrganizationById);
        app.MapGet("/api/organizations/code/{code}", HandleGetOrganizationByCode);
    }

    private static async Task<IResult> HandleGetOrganizations(
        [FromServices] OrganizationService organizationService,
        int page = 1,
        int pageSize = 20,
        string? search = null)
    {
        var (organizations, totalCount) = await organizationService.GetOrganizations(page, pageSize, search);
        var meta = CreatePaginationMeta(page, pageSize, totalCount);
        return Results.Ok(ApiResponse<List<OrganizationListResponse>>.SuccessResponse(organizations, meta));
    }

    private static PaginationMeta CreatePaginationMeta(int page, int pageSize, int totalCount)
    {
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        return new PaginationMeta { Page = page, PageSize = pageSize, TotalCount = totalCount, TotalPages = totalPages };
    }

    private static async Task<IResult> HandleGetOrganizationById(Guid id, [FromServices] OrganizationService organizationService)
    {
        var organization = await organizationService.GetOrganizationById(id);
        if (organization == null)
            return Results.NotFound(ApiResponse<OrganizationDetailResponse>.ErrorResponse("NOT_FOUND", "Organization not found"));
        return Results.Ok(ApiResponse<OrganizationDetailResponse>.SuccessResponse(organization));
    }

    private static async Task<IResult> HandleGetOrganizationByCode(string code, [FromServices] OrganizationService organizationService)
    {
        var organization = await organizationService.GetOrganizationByCode(code);
        if (organization == null)
            return Results.NotFound(ApiResponse<OrganizationCodeResponse>.ErrorResponse("NOT_FOUND", "Organization not found"));
        return Results.Ok(ApiResponse<OrganizationCodeResponse>.SuccessResponse(organization));
    }
}
