namespace ShiftGiving.Models;

public class Payout
{
    public Guid Id { get; set; }
    public Guid OrganizationId { get; set; }
    public decimal Amount { get; set; }
    public PayoutStatus Status { get; set; }
    public DateTime ScheduledDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public string? TransactionReference { get; set; }
    public DateTime CreatedAt { get; set; }

    public Organization Organization { get; set; } = null!;
}

public enum PayoutStatus
{
    Pending,
    Processing,
    Completed,
    Failed
}
