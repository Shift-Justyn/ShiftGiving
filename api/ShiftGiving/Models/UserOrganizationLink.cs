namespace ShiftGiving.Models;

public class UserOrganizationLink
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid OrganizationId { get; set; }
    public DateTime LinkedAt { get; set; }

    public User User { get; set; } = null!;
    public Organization Organization { get; set; } = null!;
}
