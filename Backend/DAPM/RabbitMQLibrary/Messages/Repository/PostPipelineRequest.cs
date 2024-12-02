using RabbitMQLibrary.Models;

namespace RabbitMQLibrary.Messages.Repository
{
    public class PostPipelineRequest
    {
        public TimeSpan TimeToLive { get; set; }
        public Guid TicketId { get; set; }
        public Guid OrganizationId { get; set; }
        public Guid RepositoryId { get; set; }
        public string? Name { get; set; }
        public Pipeline? Pipeline { get; set; }
        public Guid Owner { get; set; }
        public string? OwnerType { get; set; }
        public Guid? UserGroup { get; set; }
    }
}
