namespace ShiftGiving.DTOs;

public record NotificationResponse(
    Guid Id,
    string Title,
    string Body,
    string Type,
    bool IsRead,
    string? Data,
    DateTime CreatedAt,
    DateTime? ReadAt
);

public record NotificationListResponse(
    List<NotificationResponse> Notifications,
    int UnreadCount
);

public record MarkNotificationsReadRequest(
    List<Guid> NotificationIds
);
