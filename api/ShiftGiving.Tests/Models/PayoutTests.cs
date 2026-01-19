using ShiftGiving.Models;

namespace ShiftGiving.Tests.Models;

[Trait("Category", "Unit")]
public class PayoutTests
{
    [Fact]
    public void DefaultAmount_IsZero()
    {
        var payout = new Payout();
        Assert.Equal(0m, payout.Amount);
    }

    [Fact]
    public void DefaultTransactionReference_IsNull()
    {
        var payout = new Payout();
        Assert.Null(payout.TransactionReference);
    }

    [Fact]
    public void DefaultCompletedDate_IsNull()
    {
        var payout = new Payout();
        Assert.Null(payout.CompletedDate);
    }

    [Fact]
    public void PendingStatusExists()
    {
        Assert.Equal(0, (int)PayoutStatus.Pending);
    }

    [Fact]
    public void ProcessingStatusExists()
    {
        Assert.Equal(1, (int)PayoutStatus.Processing);
    }

    [Fact]
    public void CompletedStatusExists()
    {
        Assert.Equal(2, (int)PayoutStatus.Completed);
    }

    [Fact]
    public void FailedStatusExists()
    {
        Assert.Equal(3, (int)PayoutStatus.Failed);
    }
}
