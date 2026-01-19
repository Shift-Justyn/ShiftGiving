using ShiftGiving.Models;

namespace ShiftGiving.Tests.Models;

[Trait("Category", "Unit")]
public class UserTypeTests
{
    [Fact]
    public void IndividualTypeExists()
    {
        Assert.Equal(0, (int)UserType.Individual);
    }

    [Fact]
    public void OrganizationAdminTypeExists()
    {
        Assert.Equal(1, (int)UserType.OrganizationAdmin);
    }

    [Fact]
    public void SiteAdminTypeExists()
    {
        Assert.Equal(2, (int)UserType.SiteAdmin);
    }

    [Fact]
    public void MarketingAdminTypeExists()
    {
        Assert.Equal(3, (int)UserType.MarketingAdmin);
    }

    [Fact]
    public void CoordinatorTypeExists()
    {
        Assert.Equal(4, (int)UserType.Coordinator);
    }
}
