using ShiftGiving.Models;

namespace ShiftGiving.Tests.Models;

[Trait("Category", "Unit")]
public class NotificationTests
{
    [Fact]
    public void DefaultIsRead_IsFalse()
    {
        var notification = new Notification();
        Assert.False(notification.IsRead);
    }

    [Fact]
    public void DefaultTitle_IsEmptyString()
    {
        var notification = new Notification();
        Assert.Equal(string.Empty, notification.Title);
    }

    [Fact]
    public void DefaultBody_IsEmptyString()
    {
        var notification = new Notification();
        Assert.Equal(string.Empty, notification.Body);
    }

    [Fact]
    public void DonationConfirmedTypeExists()
    {
        Assert.Equal(0, (int)NotificationType.DonationConfirmed);
    }

    [Fact]
    public void CampaignUpdateTypeExists()
    {
        Assert.Equal(1, (int)NotificationType.CampaignUpdate);
    }

    [Fact]
    public void GoalReachedTypeExists()
    {
        Assert.Equal(2, (int)NotificationType.GoalReached);
    }

    [Fact]
    public void NewMessageTypeExists()
    {
        Assert.Equal(3, (int)NotificationType.NewMessage);
    }

    [Fact]
    public void SystemAlertTypeExists()
    {
        Assert.Equal(4, (int)NotificationType.SystemAlert);
    }
}
