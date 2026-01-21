using Microsoft.EntityFrameworkCore;
using ShiftGiving.Data;
using ShiftGiving.DTOs;
using ShiftGiving.Models;

namespace ShiftGiving.Services;

public class CampaignService
{
    private readonly ShiftGivingDbContext _db;

    public CampaignService(ShiftGivingDbContext db)
    {
        _db = db;
    }

    public async Task<(List<CampaignListResponse> campaigns, int totalCount)> GetCampaigns(
        int page,
        int pageSize,
        string? status,
        Guid? organizationId,
        string? search,
        bool? featured)
    {
        var query = BuildCampaignQuery(status, organizationId, search, featured);
        var totalCount = await query.CountAsync();
        var campaigns = await ExecuteCampaignQuery(query, page, pageSize);
        return (campaigns, totalCount);
    }

    public async Task<CampaignDetailResponse?> GetCampaignById(Guid id)
    {
        var campaign = await FetchCampaignWithDetails(id);
        return campaign == null ? null : MapToDetailResponse(campaign);
    }

    private IQueryable<Campaign> BuildCampaignQuery(
        string? status,
        Guid? organizationId,
        string? search,
        bool? featured)
    {
        var query = _db.Campaigns.Include(c => c.Organization).Include(c => c.Images).AsQueryable();
        query = ApplyStatusFilter(query, status);
        query = ApplyOrganizationFilter(query, organizationId);
        query = ApplySearchFilter(query, search);
        query = ApplyFeaturedFilter(query, featured);
        return query;
    }

    private IQueryable<Campaign> ApplyStatusFilter(IQueryable<Campaign> query, string? status)
    {
        if (string.IsNullOrEmpty(status))
            return query;
        if (Enum.TryParse<CampaignStatus>(status, true, out var statusEnum))
            return query.Where(c => c.Status == statusEnum);
        return query;
    }

    private IQueryable<Campaign> ApplyOrganizationFilter(IQueryable<Campaign> query, Guid? organizationId)
    {
        return organizationId.HasValue ? query.Where(c => c.OrganizationId == organizationId.Value) : query;
    }

    private IQueryable<Campaign> ApplySearchFilter(IQueryable<Campaign> query, string? search)
    {
        return string.IsNullOrEmpty(search) ? query : query.Where(c => c.Title.Contains(search) || (c.Description != null && c.Description.Contains(search)));
    }

    private IQueryable<Campaign> ApplyFeaturedFilter(IQueryable<Campaign> query, bool? featured)
    {
        return featured.HasValue && featured.Value ? query.Where(c => c.IsFeatured) : query;
    }

    private async Task<List<CampaignListResponse>> ExecuteCampaignQuery(IQueryable<Campaign> query, int page, int pageSize)
    {
        var campaigns = await query
            .OrderBy(c => c.DisplayOrder == 0 ? 1 : 0)
            .ThenBy(c => c.DisplayOrder)
            .ThenByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return campaigns.Select(MapToCampaignListResponse).ToList();
    }

    private CampaignListResponse MapToCampaignListResponse(Campaign c)
    {
        return new CampaignListResponse
        {
            Id = c.Id,
            Title = c.Title,
            ShortDescription = c.ShortDescription,
            GoalAmount = c.GoalAmount,
            RaisedAmount = c.RaisedAmount,
            Status = c.Status.ToString(),
            FeaturedImageUrl = c.FeaturedImageUrl,
            Organization = MapOrganizationBasicInfo(c.Organization),
            EndDate = c.EndDate,
            Category = c.Category.ToString(),
            Location = c.Location,
            UnitLabel = c.UnitLabel,
            UnitPrice = c.UnitPrice,
            ImpactLabel = c.ImpactLabel,
            StoryContent = c.StoryContent,
            MediaGallery = MapMediaGallery(c.Images)
        };
    }

    private List<MediaGalleryItem> MapMediaGallery(ICollection<CampaignImage> images)
    {
        return images.Select(i => new MediaGalleryItem
        {
            Type = "image",
            Url = i.ImageUrl,
            Caption = i.AltText
        }).ToList();
    }

    private OrganizationBasicInfo MapOrganizationBasicInfo(Organization org)
    {
        return new OrganizationBasicInfo
        {
            Id = org.Id,
            Name = org.Name,
            LogoUrl = org.LogoUrl
        };
    }

    private async Task<Campaign?> FetchCampaignWithDetails(Guid id)
    {
        return await _db.Campaigns
            .Include(c => c.Organization)
            .Include(c => c.Images)
            .Include(c => c.Programs)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    private CampaignDetailResponse MapToDetailResponse(Campaign campaign)
    {
        var response = CreateDetailResponseBase(campaign);
        response.Images = MapImages(campaign.Images);
        response.Programs = MapPrograms(campaign.Programs);
        response.SocialLinks = MapSocialLinks(campaign);
        response.Organization = MapOrganizationDetail(campaign.Organization);
        return response;
    }

    private CampaignDetailResponse CreateDetailResponseBase(Campaign campaign)
    {
        var response = new CampaignDetailResponse();
        SetBasicCampaignProperties(response, campaign);
        SetCampaignAmountsAndDates(response, campaign);
        return response;
    }

    private void SetBasicCampaignProperties(CampaignDetailResponse response, Campaign campaign)
    {
        response.Id = campaign.Id;
        response.Title = campaign.Title;
        response.Description = campaign.Description;
        response.ShortDescription = campaign.ShortDescription;
        response.Status = campaign.Status.ToString();
    }

    private void SetCampaignAmountsAndDates(CampaignDetailResponse response, Campaign campaign)
    {
        response.GoalAmount = campaign.GoalAmount;
        response.RaisedAmount = campaign.RaisedAmount;
        response.StartDate = campaign.StartDate;
        response.EndDate = campaign.EndDate;
        response.FeaturedImageUrl = campaign.FeaturedImageUrl;
        response.VideoUrl = campaign.VideoUrl;
    }

    private List<CampaignImageInfo> MapImages(ICollection<CampaignImage> images)
    {
        return images.Select(i => new CampaignImageInfo { Url = i.ImageUrl, AltText = i.AltText }).ToList();
    }

    private List<CampaignProgramInfo> MapPrograms(ICollection<CampaignProgram> programs)
    {
        return programs.Select(p => new CampaignProgramInfo { Name = p.Name, Description = p.Description }).ToList();
    }

    private CampaignSocialLinks MapSocialLinks(Campaign campaign)
    {
        return new CampaignSocialLinks
        {
            Facebook = campaign.SocialFacebook,
            Twitter = campaign.SocialTwitter,
            Instagram = campaign.SocialInstagram,
            Linkedin = campaign.SocialLinkedin
        };
    }

    private OrganizationDetailInfo MapOrganizationDetail(Organization org)
    {
        return new OrganizationDetailInfo
        {
            Id = org.Id,
            Name = org.Name,
            LogoUrl = org.LogoUrl,
            Description = org.Description
        };
    }
}
