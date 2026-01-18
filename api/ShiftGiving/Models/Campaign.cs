namespace ShiftGiving.Models;

public class Campaign
{
    public Guid Id { get; set; }
    public Guid OrganizationId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public decimal GoalAmount { get; set; }
    public decimal RaisedAmount { get; set; }
    public CampaignStatus Status { get; set; } = CampaignStatus.Draft;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public string? SocialFacebook { get; set; }
    public string? SocialTwitter { get; set; }
    public string? SocialInstagram { get; set; }
    public string? SocialLinkedin { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Organization Organization { get; set; } = null!;
    public ICollection<Donation> Donations { get; set; } = new List<Donation>();
    public ICollection<CampaignImage> Images { get; set; } = new List<CampaignImage>();
    public ICollection<CampaignProgram> Programs { get; set; } = new List<CampaignProgram>();
}

public enum CampaignStatus
{
    Draft,
    Active,
    ClosingSoon,
    Completed,
    Cancelled
}
