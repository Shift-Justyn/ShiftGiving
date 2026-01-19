using ShiftGiving.Models;

namespace ShiftGiving.Tests.Models;

[Trait("Category", "Unit")]
public class CampaignCategoryTests
{
    [Fact]
    public void EducationCategoryExists()
    {
        Assert.Equal(0, (int)CampaignCategory.Education);
    }

    [Fact]
    public void HealthCategoryExists()
    {
        Assert.Equal(1, (int)CampaignCategory.Health);
    }

    [Fact]
    public void EnvironmentCategoryExists()
    {
        Assert.Equal(2, (int)CampaignCategory.Environment);
    }

    [Fact]
    public void HumanitarianCategoryExists()
    {
        Assert.Equal(3, (int)CampaignCategory.Humanitarian);
    }

    [Fact]
    public void CommunityCategoryExists()
    {
        Assert.Equal(4, (int)CampaignCategory.Community);
    }

    [Fact]
    public void AnimalsCategoryExists()
    {
        Assert.Equal(5, (int)CampaignCategory.Animals);
    }

    [Fact]
    public void ArtsCategoryExists()
    {
        Assert.Equal(6, (int)CampaignCategory.Arts);
    }

    [Fact]
    public void ReligiousCategoryExists()
    {
        Assert.Equal(7, (int)CampaignCategory.Religious);
    }
}
