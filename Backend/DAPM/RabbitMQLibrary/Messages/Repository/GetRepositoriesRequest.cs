namespace RabbitMQLibrary.Messages.Repository
{
    public class GetRepositoriesRequest
    {
        public TimeSpan TimeToLive { get; set; }
        public Guid TicketId { get; set; }
        public Guid OrganizationId { get; set; }
        public Guid RepositoryId { get; set; }
        public Guid Owner { get; set; }        // New property
        public string? OwnerType { get; set; } // New property
        public Guid? UserGroup { get; set; }  // New property
    }
}
