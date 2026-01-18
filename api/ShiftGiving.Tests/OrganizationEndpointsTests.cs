using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using ShiftGiving.Data;
using ShiftGiving.DTOs;
using ShiftGiving.Models;

namespace ShiftGiving.Tests;

[Trait("Category", "Integration")]
public class OrganizationEndpointsTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public OrganizationEndpointsTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetOrganizations_ReturnsSuccessResponse()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/organizations");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetOrganizations_ReturnsExpectedStructure()
    {
        var client = _factory.CreateClient();
        var response = await client.GetFromJsonAsync<ApiResponse<List<OrganizationListResponse>>>("/api/organizations");

        Assert.NotNull(response);
    }

    [Fact]
    public async Task GetOrganizations_SuccessFlagIsTrue()
    {
        var client = _factory.CreateClient();
        var response = await client.GetFromJsonAsync<ApiResponse<List<OrganizationListResponse>>>("/api/organizations");

        Assert.True(response!.Success);
    }

    [Fact]
    public async Task GetOrganizationById_WithInvalidId_ReturnsNotFound()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync($"/api/organizations/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetOrganizationById_WithValidId_ReturnsSuccess()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var org = CreateTestOrganization();
        db.Organizations.Add(org);
        await db.SaveChangesAsync();

        var response = await client.GetAsync($"/api/organizations/{org.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetOrganizationById_ReturnsExpectedData()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var org = CreateTestOrganization();
        db.Organizations.Add(org);
        await db.SaveChangesAsync();

        var response = await client.GetFromJsonAsync<ApiResponse<OrganizationDetailResponse>>($"/api/organizations/{org.Id}");

        Assert.Equal(org.Name, response!.Data!.Name);
    }

    [Fact]
    public async Task GetOrganizationByCode_WithInvalidCode_ReturnsNotFound()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/organizations/code/INVALID");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetOrganizationByCode_WithValidCode_ReturnsSuccess()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var org = CreateTestOrganization();
        org.OrganizationCode = "TEST123";
        db.Organizations.Add(org);
        await db.SaveChangesAsync();

        var response = await client.GetAsync("/api/organizations/code/TEST123");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetOrganizationByCode_ReturnsExpectedData()
    {
        var client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShiftGivingDbContext>();

        var org = CreateTestOrganization();
        org.OrganizationCode = "TEST456";
        db.Organizations.Add(org);
        await db.SaveChangesAsync();

        var response = await client.GetFromJsonAsync<ApiResponse<OrganizationCodeResponse>>("/api/organizations/code/TEST456");

        Assert.Equal(org.Name, response!.Data!.Name);
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
}
