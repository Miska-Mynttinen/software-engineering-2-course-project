using DAPM.ClientApi.Services.Interfaces;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;
using RabbitMQLibrary.Messages.ResourceRegistry;
using Microsoft.Extensions.Logging;
using ResourceRegistryRequest = RabbitMQLibrary.Messages.ResourceRegistry.GetResourceFilesRequest; 
using OrchestratorRequest = RabbitMQLibrary.Messages.Orchestrator.ProcessRequests.GetResourceFilesRequest; 

namespace DAPM.ClientApi.Services
{
    public class ResourceService : IResourceService
    {
        private readonly ILogger<ResourceService> _logger;
        private readonly ITicketService _ticketService;

        private readonly IQueueProducer<OrchestratorRequest> _getResourceFilesRequestProducer;
        private readonly IQueueProducer<GetResourcesRequest> _getResourcesRequestProducer;

        public ResourceService(
            ILogger<ResourceService> logger,
            ITicketService ticketService,
            IQueueProducer<OrchestratorRequest> getResourceFilesProducer,
            IQueueProducer<GetResourcesRequest> getResourcesProducer)
        {
            _logger = logger;
            _ticketService = ticketService;
            _getResourceFilesRequestProducer = getResourceFilesProducer;
            _getResourcesRequestProducer = getResourcesProducer;
        }

        public Guid GetResourceById(Guid organizationId, Guid repositoryId, Guid resourceId)
        {
            var ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            var message = new GetResourcesRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                RepositoryId = repositoryId,
                ResourceId = resourceId,
            };

            _getResourcesRequestProducer.PublishMessage(message);
            _logger.LogDebug("GetResourcesRequest Enqueued");

            return ticketId;
        }

        public Guid GetResourceFileById(Guid organizationId, Guid repositoryId, Guid resourceId)
        {
            var ticketId = _ticketService.CreateNewTicket(TicketResolutionType.File);

            var message = new OrchestratorRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                RepositoryId = repositoryId,
                ResourceId = resourceId,
            };

            _getResourceFilesRequestProducer.PublishMessage(message);

            _logger.LogDebug("GetResourceFilesRequest Enqueued");

            return ticketId;
        }
    }
}
