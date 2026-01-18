namespace ShiftGiving.Models;

public class CampaignImage
{
    public Guid Id { get; set; }
    public Guid CampaignId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }

    public Campaign Campaign { get; set; } = null!;
}
