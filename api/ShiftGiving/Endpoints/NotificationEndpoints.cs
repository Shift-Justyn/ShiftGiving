using System.Security.Claims;
using ShiftGiving.DTOs;
using ShiftGiving.Services;

namespace ShiftGiving.Endpoints;

public static class NotificationEndpoints
{
    public static void MapNotificationEndpoints(this WebApplication app)
    {
        app.MapGet("/api/notifications", HandleGetNotifications).RequireAuthorization();
        app.MapGet("/api/notifications/unread-count", HandleGetUnreadCount).RequireAuthorization();
        app.MapPost("/api/notifications/mark-read", HandleMarkNotificationsRead).RequireAuthorization();
    }

    private static async Task<IResult> HandleGetNotifications(
        HttpContext httpContext,
        NotificationService notificationService,
        int page = 1,
        int pageSize = 20)
    {
        var userId = ExtractUserIdFromClaims(httpContext);
        if (userId == Guid.Empty)
            return Results.Unauthorized();
        var (notifications, totalCount) = await notificationService.GetUserNotifications(userId, page, pageSize);
        var meta = CreatePaginationMeta(page, pageSize, totalCount);
        return Results.Ok(ApiResponse<List<NotificationResponse>>.SuccessResponse(notifications, meta));
    }

    private static async Task<IResult> HandleGetUnreadCount(
        HttpContext httpContext,
        NotificationService notificationService)
    {
        var userId = ExtractUserIdFromClaims(httpContext);
        if (userId == Guid.Empty)
            return Results.Unauthorized();
        var unreadCount = await notificationService.GetUnreadCount(userId);
        return Results.Ok(ApiResponse<int>.SuccessResponse(unreadCount));
    }

    private static async Task<IResult> HandleMarkNotificationsRead(
        HttpContext httpContext,
        MarkNotificationsReadRequest request,
        NotificationService notificationService)
    {
        var userId = ExtractUserIdFromClaims(httpContext);
        if (userId == Guid.Empty)
            return Results.Unauthorized();
        await notificationService.MarkAsRead(userId, request.NotificationIds);
        return Results.Ok(ApiResponse<object>.SuccessResponse(new { }));
    }

    private static Guid ExtractUserIdFromClaims(HttpContext httpContext)
    {
        var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    private static PaginationMeta CreatePaginationMeta(int page, int pageSize, int totalCount)
    {
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        return new PaginationMeta { Page = page, PageSize = pageSize, TotalCount = totalCount, TotalPages = totalPages };
    }
}
