using ShiftGiving.Models;

namespace ShiftGiving.Tests.Models;

[Trait("Category", "Unit")]
public class DonationTests
{
    [Fact]
    public void DefaultStatus_IsPending()
    {
        var donation = new Donation();
        Assert.Equal(DonationStatus.Pending, donation.Status);
    }

    [Fact]
    public void DefaultIsAnonymous_IsFalse()
    {
        var donation = new Donation();
        Assert.False(donation.IsAnonymous);
    }

    [Fact]
    public void DefaultReceiptSent_IsFalse()
    {
        var donation = new Donation();
        Assert.False(donation.ReceiptSent);
    }

    [Fact]
    public void DefaultAmount_IsZero()
    {
        var donation = new Donation();
        Assert.Equal(0m, donation.Amount);
    }
}
