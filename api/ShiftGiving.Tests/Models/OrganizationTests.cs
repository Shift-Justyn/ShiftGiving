using ShiftGiving.Models;

namespace ShiftGiving.Tests.Models;

[Trait("Category", "Unit")]
public class OrganizationTests
{
    [Fact]
    public void DefaultCountry_IsUSA()
    {
        var org = new Organization();
        Assert.Equal("USA", org.Country);
    }

    [Fact]
    public void DefaultIsVerified_IsFalse()
    {
        var org = new Organization();
        Assert.False(org.IsVerified);
    }

    [Fact]
    public void DefaultIsActive_IsTrue()
    {
        var org = new Organization();
        Assert.True(org.IsActive);
    }

    [Fact]
    public void DefaultName_IsEmptyString()
    {
        var org = new Organization();
        Assert.Equal(string.Empty, org.Name);
    }

    [Fact]
    public void Campaigns_DefaultsToEmptyList()
    {
        var org = new Organization();
        Assert.Empty(org.Campaigns);
    }

    [Fact]
    public void Admins_DefaultsToEmptyList()
    {
        var org = new Organization();
        Assert.Empty(org.Admins);
    }
}
