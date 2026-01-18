namespace ShiftGiving.Models;

public class Donation
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CampaignId { get; set; }
    public Guid OrganizationId { get; set; }
    public decimal Amount { get; set; }
    public DonationStatus Status { get; set; } = DonationStatus.Pending;
    public string? PaymentMethod { get; set; }
    public string? PaymentIntentId { get; set; }
    public bool IsAnonymous { get; set; }
    public string? DonorMessage { get; set; }
    public bool ReceiptSent { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User User { get; set; } = null!;
    public Campaign Campaign { get; set; } = null!;
    public Organization Organization { get; set; } = null!;
}

public enum DonationStatus
{
    Pending,
    Completed,
    Failed,
    Refunded
}
