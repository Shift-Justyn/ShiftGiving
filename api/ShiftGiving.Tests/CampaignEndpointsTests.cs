using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using ShiftGiving.Data;
using ShiftGiving.DTOs;
using ShiftGiving.Models;

namespace ShiftGiving.Tests;

[Trait("Category", "Integration")]
public class CampaignEndpointsTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public CampaignEndpointsTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetCampaigns_ReturnsSuccessResponse()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/campaigns");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetCampaigns_ReturnsExpectedStructure()
    {
        var client = _factory.CreateClient();
        var response = await client.GetFromJsonAsync<ApiResponse<List<CampaignListResponse>>>("/api/campaigns");

        Assert.NotNull(response);
    }

    [Fact]
    public async Task GetCampaigns_SuccessFlagIsTrue()
    {
        var client = _factory.CreateClient();
        var response = await client.GetFromJsonAsync<ApiResponse<List<CampaignListResponse>>>("/api/campaigns");

        Assert.True(response!.Success);
    }

    [Fact]
    public async Task GetCampaigns_ContainsPaginationMeta()
    {
        var client = _factory.CreateClient();
        var response = await client.GetFromJsonAsync<ApiResponse<List<CampaignListResponse>>>("/api/campaigns");

        Assert.NotNull(response!.Meta);
    }

    [Fact]
    public async Task GetCampaigns_WithPagination_ReturnsCorrectPage()
    {
        var client = _factory.CreateClient();
        var response = await client.GetFromJsonAsync<ApiResponse<List<CampaignListResponse>>>("/api/campaigns?page=1&pageSize=10");

        Assert.Equal(1, response!.Meta!.Page);
    }

    [Fact]
    public async Task GetCampaigns_WithPagination_ReturnsCorrectPageSize()
    {
        var client = _factory.CreateClient();
        var response = await client.GetFromJsonAsync<ApiResponse<List<CampaignListResponse>>>("/api/campaigns?page=1&pageSize=10");

        Assert.Equal(10, response!.Meta!.PageSize);
    }

    [Fact]
    public async Task GetCampaignById_WithInvalidId_ReturnsNotFound()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync($"/api/campaigns/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetCampaignById_WithValidId_ReturnsSuccess()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var org = CreateTestOrganization();
        var campaign = CreateTestCampaign(org.Id);
        db.Organizations.Add(org);
        db.Campaigns.Add(campaign);
        await db.SaveChangesAsync();

        var response = await client.GetAsync($"/api/campaigns/{campaign.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetCampaignById_ReturnsExpectedData()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var org = CreateTestOrganization();
        var campaign = CreateTestCampaign(org.Id);
        db.Organizations.Add(org);
        db.Campaigns.Add(campaign);
        await db.SaveChangesAsync();

        var response = await client.GetFromJsonAsync<ApiResponse<CampaignDetailResponse>>($"/api/campaigns/{campaign.Id}");

        Assert.Equal(campaign.Title, response!.Data!.Title);
    }

    private Organization CreateTestOrganization()
    {
        return new Organization
        {
            Id = Guid.NewGuid(),
            Name = "Test Organization",
            Description = "Test Description",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private Campaign CreateTestCampaign(Guid organizationId)
    {
        return new Campaign
        {
            Id = Guid.NewGuid(),
            OrganizationId = organizationId,
            Title = "Test Campaign",
            Description = "Test Description",
            ShortDescription = "Short Description",
            GoalAmount = 10000,
            RaisedAmount = 5000,
            Status = CampaignStatus.Active,
            StartDate = DateOnly.FromDateTime(DateTime.UtcNow),
            EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
