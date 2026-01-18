using ShiftGiving.Models;

namespace ShiftGiving.Tests.Models;

[Trait("Category", "Unit")]
public class UserTests
{
    [Fact]
    public void DefaultUserType_IsIndividual()
    {
        var user = new User();
        Assert.Equal(UserType.Individual, user.UserType);
    }

    [Fact]
    public void DefaultIsActive_IsTrue()
    {
        var user = new User();
        Assert.True(user.IsActive);
    }

    [Fact]
    public void DefaultEmailVerified_IsFalse()
    {
        var user = new User();
        Assert.False(user.EmailVerified);
    }

    [Fact]
    public void DefaultEmail_IsEmptyString()
    {
        var user = new User();
        Assert.Equal(string.Empty, user.Email);
    }

    [Fact]
    public void Donations_DefaultsToEmptyList()
    {
        var user = new User();
        Assert.Empty(user.Donations);
    }

    [Fact]
    public void OrganizationLinks_DefaultsToEmptyList()
    {
        var user = new User();
        Assert.Empty(user.OrganizationLinks);
    }
}
