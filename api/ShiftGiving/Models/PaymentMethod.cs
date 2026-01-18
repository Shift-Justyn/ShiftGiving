namespace ShiftGiving.Models;

public class PaymentMethod
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string StripePaymentMethodId { get; set; } = string.Empty;
    public string? CardBrand { get; set; }
    public string? CardLastFour { get; set; }
    public int? CardExpMonth { get; set; }
    public int? CardExpYear { get; set; }
    public bool IsDefault { get; set; }
    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
}
