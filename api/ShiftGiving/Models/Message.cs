namespace ShiftGiving.Models;

public class Message
{
    public Guid Id { get; set; }
    public Guid OrganizationId { get; set; }
    public Guid SenderId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public MessageType MessageType { get; set; }
    public MessageStatus Status { get; set; } = MessageStatus.Draft;
    public DateTime? ScheduledAt { get; set; }
    public DateTime? SentAt { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Organization Organization { get; set; } = null!;
    public User Sender { get; set; } = null!;
}

public enum MessageType
{
    Story,
    Update,
    Announcement
}

public enum MessageStatus
{
    Draft,
    Scheduled,
    Sent
}
