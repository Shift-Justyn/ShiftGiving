using Microsoft.EntityFrameworkCore;
using ShiftGiving.Data;
using ShiftGiving.DTOs;
using ShiftGiving.Models;

namespace ShiftGiving.Services;

public class OrganizationService
{
    private readonly ShiftGivingDbContext _db;

    public OrganizationService(ShiftGivingDbContext db)
    {
        _db = db;
    }

    public async Task<(List<OrganizationListResponse> organizations, int totalCount)> GetOrganizations(
        int page,
        int pageSize,
        string? search)
    {
        var query = BuildOrganizationQuery(search);
        var totalCount = await query.CountAsync();
        var organizations = await ExecuteOrganizationQuery(query, page, pageSize);
        return (organizations, totalCount);
    }

    public async Task<OrganizationDetailResponse?> GetOrganizationById(Guid id)
    {
        var organization = await FetchOrganizationWithCampaigns(id);
        return organization == null ? null : MapToDetailResponse(organization);
    }

    public async Task<OrganizationCodeResponse?> GetOrganizationByCode(string code)
    {
        var organization = await FetchOrganizationByCode(code);
        return organization == null ? null : MapToCodeResponse(organization);
    }

    private IQueryable<Organization> BuildOrganizationQuery(string? search)
    {
        var query = _db.Organizations.AsQueryable();
        return ApplySearchFilter(query, search);
    }

    private IQueryable<Organization> ApplySearchFilter(IQueryable<Organization> query, string? search)
    {
        return string.IsNullOrEmpty(search) ? query : query.Where(o => o.Name.Contains(search) || (o.Description != null && o.Description.Contains(search)));
    }

    private async Task<List<OrganizationListResponse>> ExecuteOrganizationQuery(IQueryable<Organization> query, int page, int pageSize)
    {
        var organizations = await query
            .OrderBy(o => o.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return organizations.Select(MapToListResponse).ToList();
    }

    private OrganizationListResponse MapToListResponse(Organization o) =>
        new OrganizationListResponse
        {
            Id = o.Id,
            Name = o.Name,
            Description = o.Description,
            LogoUrl = o.LogoUrl,
            CampaignCount = o.Campaigns.Count
        };

    private async Task<Organization?> FetchOrganizationWithCampaigns(Guid id)
    {
        return await _db.Organizations
            .Include(o => o.Campaigns.Where(c => c.Status == CampaignStatus.Active))
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    private async Task<Organization?> FetchOrganizationByCode(string code)
    {
        return await _db.Organizations.FirstOrDefaultAsync(o => o.OrganizationCode == code);
    }

    private OrganizationDetailResponse MapToDetailResponse(Organization org) =>
        new OrganizationDetailResponse
        {
            Id = org.Id,
            Name = org.Name,
            Description = org.Description,
            LogoUrl = org.LogoUrl,
            WebsiteUrl = org.WebsiteUrl,
            ContactEmail = org.ContactEmail,
            ActiveCampaigns = MapActiveCampaigns(org.Campaigns)
        };

    private List<ActiveCampaignInfo> MapActiveCampaigns(ICollection<Campaign> campaigns)
    {
        return campaigns.Select(c => new ActiveCampaignInfo { Id = c.Id, Title = c.Title }).ToList();
    }

    private OrganizationCodeResponse MapToCodeResponse(Organization org)
    {
        return new OrganizationCodeResponse
        {
            Id = org.Id,
            Name = org.Name,
            LogoUrl = org.LogoUrl
        };
    }
}
