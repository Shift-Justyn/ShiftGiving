using ShiftGiving.Models;

namespace ShiftGiving.Data;

public static class TestDataSeeder
{
    public static void SeedTestData(ShiftGivingDbContext db)
    {
        if (db.Users.Any()) return;

        var org = new Organization
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Name = "Education Foundation",
            Description = "Supporting education worldwide",
            OrganizationCode = "EDUCATE",
            ContactEmail = "contact@educationfoundation.org",
            IsVerified = true,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.Organizations.Add(org);

        var user = new User
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            Email = "donor@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
            FirstName = "Sarah",
            LastName = "Johnson",
            UserType = UserType.Individual,
            IsActive = true,
            EmailVerified = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.Users.Add(user);

        var campaign = new Campaign
        {
            Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
            OrganizationId = org.Id,
            Title = "Build Schools in Rural Communities",
            Description = "Help us build schools in underserved rural communities to provide children with access to quality education.",
            ShortDescription = "Building schools in rural areas",
            GoalAmount = 100000m,
            RaisedAmount = 25000m,
            Status = CampaignStatus.Active,
            Category = CampaignCategory.Education,
            StartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-30)),
            EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(60)),
            IsFeatured = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.Campaigns.Add(campaign);

        db.SaveChanges();
    }
}
