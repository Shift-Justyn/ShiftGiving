namespace ShiftGiving.DTOs;

public class CampaignListResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public decimal GoalAmount { get; set; }
    public decimal RaisedAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? FeaturedImageUrl { get; set; }
    public OrganizationBasicInfo Organization { get; set; } = null!;
    public DateOnly EndDate { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? UnitLabel { get; set; }
    public decimal? UnitPrice { get; set; }
    public string? ImpactLabel { get; set; }
    public string? StoryContent { get; set; }
    public List<MediaGalleryItem> MediaGallery { get; set; } = new();
}

public class MediaGalleryItem
{
    public string Type { get; set; } = "image";
    public string Url { get; set; } = string.Empty;
    public string? Caption { get; set; }
}

public class CampaignDetailResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public decimal GoalAmount { get; set; }
    public decimal RaisedAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public List<CampaignImageInfo> Images { get; set; } = new();
    public List<CampaignProgramInfo> Programs { get; set; } = new();
    public CampaignSocialLinks SocialLinks { get; set; } = new();
    public OrganizationDetailInfo Organization { get; set; } = null!;
}

public class CreateCampaignRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public decimal GoalAmount { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? FeaturedImageUrl { get; set; }
}

public class UpdateCampaignRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public decimal GoalAmount { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? FeaturedImageUrl { get; set; }
}

public class OrganizationBasicInfo
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
}

public class OrganizationDetailInfo
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? Description { get; set; }
}

public class CampaignImageInfo
{
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
}

public class CampaignProgramInfo
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class CampaignSocialLinks
{
    public string? Facebook { get; set; }
    public string? Twitter { get; set; }
    public string? Instagram { get; set; }
    public string? Linkedin { get; set; }
}
