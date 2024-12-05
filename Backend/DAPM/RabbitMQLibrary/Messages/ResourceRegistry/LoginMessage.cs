using RabbitMQLibrary.Interfaces;

public class LoginMessage : IQueueMessage
{
    public Guid ProcessId { get; set; }
    public TimeSpan TimeToLive { get; set; } = TimeSpan.FromMinutes(1);
    public Guid OrgId {get; set;}
    public string Username { get; set; }
    public string Password { get; set; }
    public Guid MessageId { get; set; }
}
