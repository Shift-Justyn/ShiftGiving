using Microsoft.Extensions.Configuration;

namespace ShiftGiving.Services;

public record PaymentIntentResult(string PaymentIntentId, string ClientSecret, string Status);

public record PaymentResult(bool Success, string Status, string? ErrorMessage);

public interface IPaymentService
{
    Task<PaymentIntentResult> CreatePaymentIntent(decimal amount, string currency, string? customerId);
    Task<PaymentResult> ConfirmPayment(string paymentIntentId);
    Task<bool> CancelPayment(string paymentIntentId);
    Task<string> CreateCustomer(string email, string name);
}

public class StripePaymentService : IPaymentService
{
    private readonly IConfiguration _configuration;

    public StripePaymentService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Task<PaymentIntentResult> CreatePaymentIntent(decimal amount, string currency, string? customerId)
    {
        var paymentIntentId = GeneratePaymentIntentId();
        var clientSecret = GenerateClientSecret(paymentIntentId);
        var result = new PaymentIntentResult(paymentIntentId, clientSecret, "requires_confirmation");
        return Task.FromResult(result);
    }

    public Task<PaymentResult> ConfirmPayment(string paymentIntentId)
    {
        var result = new PaymentResult(true, "succeeded", null);
        return Task.FromResult(result);
    }

    public Task<bool> CancelPayment(string paymentIntentId)
    {
        return Task.FromResult(true);
    }

    public Task<string> CreateCustomer(string email, string name)
    {
        var customerId = GenerateCustomerId();
        return Task.FromResult(customerId);
    }

    private string GeneratePaymentIntentId()
    {
        return $"pi_mock_{Guid.NewGuid()}";
    }

    private string GenerateClientSecret(string paymentIntentId)
    {
        return $"{paymentIntentId}_secret_{Guid.NewGuid()}";
    }

    private string GenerateCustomerId()
    {
        return $"cus_mock_{Guid.NewGuid()}";
    }
}
