namespace ShiftGiving.DTOs;

public class CreateDonationRequest
{
    public decimal Amount { get; set; }
    public Guid CampaignId { get; set; }
    public Guid OrganizationId { get; set; }
    public bool IsAnonymous { get; set; }
    public string? DonorMessage { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
}

public class DonationResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CampaignId { get; set; }
    public Guid OrganizationId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? PaymentMethod { get; set; }
    public string? PaymentIntentId { get; set; }
    public bool IsAnonymous { get; set; }
    public string? DonorMessage { get; set; }
    public bool ReceiptSent { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? CampaignTitle { get; set; }
    public string? OrganizationName { get; set; }
}

public class DonationListResponse
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string CampaignTitle { get; set; } = string.Empty;
    public string OrganizationName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class DonationSummary
{
    public int TotalDonations { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal AverageDonation { get; set; }
}
