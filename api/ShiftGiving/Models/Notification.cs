namespace ShiftGiving.Models;

public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public NotificationType Type { get; set; }
    public bool IsRead { get; set; } = false;
    public string? Data { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ReadAt { get; set; }

    public User User { get; set; } = null!;
}

public enum NotificationType
{
    DonationConfirmed,
    CampaignUpdate,
    GoalReached,
    NewMessage,
    SystemAlert
}
