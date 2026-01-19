namespace ShiftGiving.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; }
    public UserType UserType { get; set; }
    public Guid? OrganizationId { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public bool EmailVerified { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Organization? Organization { get; set; }
    public ICollection<Donation> Donations { get; set; } = new List<Donation>();
    public ICollection<UserOrganizationLink> OrganizationLinks { get; set; } = new List<UserOrganizationLink>();
    public ICollection<PaymentMethod> PaymentMethods { get; set; } = new List<PaymentMethod>();
}

public enum UserType
{
    Individual,
    OrganizationAdmin,
    SiteAdmin,
    MarketingAdmin,
    Coordinator
}
