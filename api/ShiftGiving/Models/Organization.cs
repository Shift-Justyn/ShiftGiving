namespace ShiftGiving.Models;

public class Organization
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? OrganizationCode { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string Country { get; set; } = "USA";
    public string? TaxId { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? Category { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsVerified { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<User> Admins { get; set; } = new List<User>();
    public ICollection<Campaign> Campaigns { get; set; } = new List<Campaign>();
    public ICollection<Donation> Donations { get; set; } = new List<Donation>();
    public ICollection<UserOrganizationLink> UserLinks { get; set; } = new List<UserOrganizationLink>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
