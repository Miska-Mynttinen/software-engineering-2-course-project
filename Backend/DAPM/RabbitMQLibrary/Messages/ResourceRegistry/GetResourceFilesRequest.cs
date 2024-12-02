using RabbitMQLibrary.Interfaces;

namespace RabbitMQLibrary.Messages.ResourceRegistry
{
    public class GetResourceFilesRequest
    {
        public TimeSpan TimeToLive { get; set; }
        public Guid TicketId { get; set; }
        public Guid OrganizationId { get; set; }
        public Guid RepositoryId { get; set; }
        public Guid ResourceId { get; set; }
        public Guid Owner { get; set; }       
        public string? OwnerType { get; set; }  
        public Guid? UserGroup { get; set; }   
    }
}
