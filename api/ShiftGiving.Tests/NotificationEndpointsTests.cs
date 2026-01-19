using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ShiftGiving.Data;
using ShiftGiving.DTOs;
using ShiftGiving.Models;

namespace ShiftGiving.Tests;

[Trait("Category", "Integration")]
public class NotificationEndpointsTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public NotificationEndpointsTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetNotifications_ReturnsSuccessResponse()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        db.Users.Add(user);
        await db.SaveChangesAsync();

        TestAuthHelper.CreateAuthenticatedClient(client, user.Id);
        var response = await client.GetAsync($"/api/notifications?page=1&pageSize=20");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetNotifications_ReturnsNotifications()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        var notification = CreateTestNotification(user.Id);
        db.Users.Add(user);
        db.Notifications.Add(notification);
        await db.SaveChangesAsync();

        TestAuthHelper.CreateAuthenticatedClient(client, user.Id);
        var response = await client.GetFromJsonAsync<ApiResponse<List<NotificationResponse>>>($"/api/notifications?page=1&pageSize=20");

        Assert.NotNull(response);
        Assert.True(response.Success);
        Assert.NotNull(response.Data);
    }

    [Fact]
    public async Task GetUnreadCount_ReturnsSuccessResponse()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        db.Users.Add(user);
        await db.SaveChangesAsync();

        TestAuthHelper.CreateAuthenticatedClient(client, user.Id);
        var response = await client.GetAsync($"/api/notifications/unread-count");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetUnreadCount_ReturnsCorrectCount()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        var unreadNotification = CreateTestNotification(user.Id);
        var readNotification = CreateTestNotification(user.Id);
        readNotification.IsRead = true;
        readNotification.ReadAt = DateTime.UtcNow;
        db.Users.Add(user);
        db.Notifications.Add(unreadNotification);
        db.Notifications.Add(readNotification);
        await db.SaveChangesAsync();

        TestAuthHelper.CreateAuthenticatedClient(client, user.Id);
        var response = await client.GetFromJsonAsync<ApiResponse<int>>($"/api/notifications/unread-count");

        Assert.NotNull(response);
        Assert.True(response.Success);
        Assert.Equal(1, response.Data);
    }

    [Fact]
    public async Task MarkNotificationsRead_ReturnsSuccessResponse()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        var notification = CreateTestNotification(user.Id);
        db.Users.Add(user);
        db.Notifications.Add(notification);
        await db.SaveChangesAsync();

        TestAuthHelper.CreateAuthenticatedClient(client, user.Id);
        var request = new MarkNotificationsReadRequest(new List<Guid> { notification.Id });
        var response = await client.PostAsJsonAsync($"/api/notifications/mark-read", request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task MarkNotificationsRead_UpdatesNotifications()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        var notification = CreateTestNotification(user.Id);
        db.Users.Add(user);
        db.Notifications.Add(notification);
        await db.SaveChangesAsync();

        var notificationId = notification.Id;
        TestAuthHelper.CreateAuthenticatedClient(client, user.Id);
        var request = new MarkNotificationsReadRequest(new List<Guid> { notificationId });
        var response = await client.PostAsJsonAsync($"/api/notifications/mark-read", request);

        Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
        db.ChangeTracker.Clear();
        var updatedNotification = await db.Notifications.FirstAsync(n => n.Id == notificationId);
        Assert.True(updatedNotification.IsRead);
        Assert.NotNull(updatedNotification.ReadAt);
    }

    private User CreateTestUser()
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Email = "test@example.com",
            PasswordHash = "hashedpassword",
            FirstName = "Test",
            LastName = "User",
            UserType = UserType.Individual,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private Notification CreateTestNotification(Guid userId)
    {
        return new Notification
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = "Test Notification",
            Body = "This is a test notification",
            Type = NotificationType.DonationConfirmed,
            IsRead = false,
            Data = null,
            CreatedAt = DateTime.UtcNow
        };
    }
}
