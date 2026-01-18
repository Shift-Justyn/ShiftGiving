using ShiftGiving.Models;

namespace ShiftGiving.Tests.Models;

[Trait("Category", "Unit")]
public class CampaignTests
{
    [Fact]
    public void DefaultStatus_IsDraft()
    {
        var campaign = new Campaign();
        Assert.Equal(CampaignStatus.Draft, campaign.Status);
    }

    [Fact]
    public void DefaultIsFeatured_IsFalse()
    {
        var campaign = new Campaign();
        Assert.False(campaign.IsFeatured);
    }

    [Fact]
    public void DefaultTitle_IsEmptyString()
    {
        var campaign = new Campaign();
        Assert.Equal(string.Empty, campaign.Title);
    }

    [Fact]
    public void Donations_DefaultsToEmptyList()
    {
        var campaign = new Campaign();
        Assert.Empty(campaign.Donations);
    }

    [Fact]
    public void Images_DefaultsToEmptyList()
    {
        var campaign = new Campaign();
        Assert.Empty(campaign.Images);
    }

    [Fact]
    public void Programs_DefaultsToEmptyList()
    {
        var campaign = new Campaign();
        Assert.Empty(campaign.Programs);
    }
}
