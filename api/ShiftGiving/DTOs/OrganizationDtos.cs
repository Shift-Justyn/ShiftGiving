namespace ShiftGiving.DTOs;

public class OrganizationListResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public int CampaignCount { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? Category { get; set; }
}

public class OrganizationDetailResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? ContactEmail { get; set; }
    public List<ActiveCampaignInfo> ActiveCampaigns { get; set; } = new();
}

public class OrganizationCodeResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
}

public class ActiveCampaignInfo
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
}
