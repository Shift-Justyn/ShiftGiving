using Microsoft.EntityFrameworkCore;
using ShiftGiving.Data;
using ShiftGiving.DTOs;
using ShiftGiving.Models;

namespace ShiftGiving.Services;

public class NotificationService
{
    private readonly ShiftGivingDbContext _db;

    public NotificationService(ShiftGivingDbContext db)
    {
        _db = db;
    }

    public async Task<(List<NotificationResponse> notifications, int totalCount)> GetUserNotifications(Guid userId, int page, int pageSize)
    {
        var query = _db.Notifications.Where(n => n.UserId == userId);
        var totalCount = await query.CountAsync();
        var notifications = await ExecuteNotificationQuery(query, page, pageSize);
        return (notifications, totalCount);
    }

    public async Task<int> GetUnreadCount(Guid userId)
    {
        return await _db.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead);
    }

    public async Task MarkAsRead(Guid userId, List<Guid> notificationIds)
    {
        var notifications = await _db.Notifications
            .Where(n => n.UserId == userId && notificationIds.Contains(n.Id))
            .ToListAsync();
        notifications.ForEach(n =>
        {
            n.IsRead = true;
            n.ReadAt = DateTime.UtcNow;
        });
        await _db.SaveChangesAsync();
    }

    public async Task CreateNotification(Guid userId, string title, string body, NotificationType type, string? data)
    {
        var notification = BuildNotificationFromParameters(userId, title, body, type, data);
        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync();
    }

    private Notification BuildNotificationFromParameters(Guid userId, string title, string body, NotificationType type, string? data)
    {
        return new Notification
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = title,
            Body = body,
            Type = type,
            IsRead = false,
            Data = data,
            CreatedAt = DateTime.UtcNow
        };
    }

    private async Task<List<NotificationResponse>> ExecuteNotificationQuery(IQueryable<Notification> query, int page, int pageSize)
    {
        return await query
            .OrderByDescending(n => n.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(n => MapToNotificationResponse(n))
            .ToListAsync();
    }

    private NotificationResponse MapToNotificationResponse(Notification n)
    {
        return new NotificationResponse(
            n.Id,
            n.Title,
            n.Body,
            n.Type.ToString(),
            n.IsRead,
            n.Data,
            n.CreatedAt,
            n.ReadAt
        );
    }
}
