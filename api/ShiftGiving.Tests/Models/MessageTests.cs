using ShiftGiving.Models;

namespace ShiftGiving.Tests.Models;

[Trait("Category", "Unit")]
public class MessageTests
{
    [Fact]
    public void DefaultStatus_IsDraft()
    {
        var message = new Message();
        Assert.Equal(MessageStatus.Draft, message.Status);
    }

    [Fact]
    public void DefaultMessageType_IsStory()
    {
        var message = new Message();
        Assert.Equal(MessageType.Story, message.MessageType);
    }

    [Fact]
    public void DefaultTitle_IsEmptyString()
    {
        var message = new Message();
        Assert.Equal(string.Empty, message.Title);
    }

    [Fact]
    public void DefaultContent_IsEmptyString()
    {
        var message = new Message();
        Assert.Equal(string.Empty, message.Content);
    }
}
