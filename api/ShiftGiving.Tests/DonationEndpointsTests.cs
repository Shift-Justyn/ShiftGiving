using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using ShiftGiving.Data;
using ShiftGiving.DTOs;
using ShiftGiving.Models;

namespace ShiftGiving.Tests;

[Trait("Category", "Integration")]
public class DonationEndpointsTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public DonationEndpointsTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetDonationById_WithInvalidId_ReturnsNotFound()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync($"/api/donations/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetDonationById_WithValidId_ReturnsSuccess()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        var org = CreateTestOrganization();
        var campaign = CreateTestCampaign(org.Id);
        var donation = CreateTestDonation(user.Id, campaign.Id, org.Id);
        db.Users.Add(user);
        db.Organizations.Add(org);
        db.Campaigns.Add(campaign);
        db.Donations.Add(donation);
        await db.SaveChangesAsync();

        var response = await client.GetAsync($"/api/donations/{donation.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetDonationsByCampaign_ReturnsSuccessResponse()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        var org = CreateTestOrganization();
        var campaign = CreateTestCampaign(org.Id);
        db.Users.Add(user);
        db.Organizations.Add(org);
        db.Campaigns.Add(campaign);
        await db.SaveChangesAsync();

        var response = await client.GetAsync($"/api/donations/campaign/{campaign.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetDonationsByCampaign_ReturnsExpectedStructure()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        var org = CreateTestOrganization();
        var campaign = CreateTestCampaign(org.Id);
        db.Users.Add(user);
        db.Organizations.Add(org);
        db.Campaigns.Add(campaign);
        await db.SaveChangesAsync();

        var response = await client.GetFromJsonAsync<ApiResponse<List<DonationResponse>>>($"/api/donations/campaign/{campaign.Id}");

        Assert.NotNull(response);
    }

    [Fact]
    public async Task GetDonationsByUser_ReturnsSuccessResponse()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var response = await client.GetAsync($"/api/donations/user/{user.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetDonationSummary_ReturnsSuccessResponse()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        var org = CreateTestOrganization();
        var campaign = CreateTestCampaign(org.Id);
        db.Users.Add(user);
        db.Organizations.Add(org);
        db.Campaigns.Add(campaign);
        await db.SaveChangesAsync();

        var response = await client.GetAsync($"/api/donations/campaign/{campaign.Id}/summary");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetDonationSummary_ReturnsExpectedStructure()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var user = CreateTestUser();
        var org = CreateTestOrganization();
        var campaign = CreateTestCampaign(org.Id);
        db.Users.Add(user);
        db.Organizations.Add(org);
        db.Campaigns.Add(campaign);
        await db.SaveChangesAsync();

        var response = await client.GetFromJsonAsync<ApiResponse<DonationSummary>>($"/api/donations/campaign/{campaign.Id}/summary");

        Assert.NotNull(response);
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

    private Donation CreateTestDonation(Guid userId, Guid campaignId, Guid organizationId)
    {
        return new Donation
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CampaignId = campaignId,
            OrganizationId = organizationId,
            Amount = 100.00m,
            Status = DonationStatus.Completed,
            PaymentMethod = "card",
            IsAnonymous = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
