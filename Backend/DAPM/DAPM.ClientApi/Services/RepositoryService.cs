using DAPM.ClientApi.Models.DTOs;
using DAPM.ClientApi.Services.Interfaces;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;
using RepositoryRequests = RabbitMQLibrary.Messages.Repository;
using RabbitMQLibrary.Messages.ResourceRegistry;
using RabbitMQLibrary.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.IO;


namespace DAPM.ClientApi.Services
{
    public class RepositoryService : IRepositoryService
    {
        private readonly ILogger<RepositoryService> _logger;
        private readonly ITicketService _ticketService;

        private readonly IQueueProducer<GetRepositoriesRequest> _getRepositoriesRequestProducer;
        private readonly IQueueProducer<GetResourcesRequest> _getResourcesRequestProducer;
        private readonly IQueueProducer<PostResourceRequest> _postResourceRequestProducer;
        private readonly IQueueProducer<PostOperatorRequest> _postOperatorRequestProducer;
        private readonly IQueueProducer<PostPipelineRequest> _postPipelineRequestProducer;
        private readonly IQueueProducer<GetPipelinesRequest> _getPipelinesRequestProducer;

        public RepositoryService(
            ILogger<RepositoryService> logger,
            ITicketService ticketService,
            IQueueProducer<GetRepositoriesRequest> getRepositoriesRequestProducer,
            IQueueProducer<GetResourcesRequest> getResourcesRequestProducer,
            IQueueProducer<PostResourceRequest> postResourceRequestProducer,
            IQueueProducer<PostPipelineRequest> postPipelineRequestProducer,
            IQueueProducer<GetPipelinesRequest> getPipelinesRequestProducer,
            IQueueProducer<PostOperatorRequest> postOperatorRequestProducer)
        {
            _ticketService = ticketService;
            _logger = logger;
            _getRepositoriesRequestProducer = getRepositoriesRequestProducer;
            _getResourcesRequestProducer = getResourcesRequestProducer;
            _postResourceRequestProducer = postResourceRequestProducer;
            _postPipelineRequestProducer = postPipelineRequestProducer;
            _getPipelinesRequestProducer = getPipelinesRequestProducer;
            _postOperatorRequestProducer = postOperatorRequestProducer;
        }

        public Guid GetRepositoryById(Guid organizationId, Guid repositoryId)
        {
            var ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            var message = new GetRepositoriesRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                RepositoryId = repositoryId,
            };

            _getRepositoriesRequestProducer.PublishMessage(message);

            _logger.LogDebug("GetRepositoriesRequest Enqueued");

            return ticketId;
        }

        public Guid GetResourcesOfRepository(Guid organizationId, Guid repositoryId)
        {
            var ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            var message = new GetResourcesRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                RepositoryId = repositoryId,
            };

            _getResourcesRequestProducer.PublishMessage(message);

            _logger.LogDebug("GetResourcesRequest Enqueued");

            return ticketId;
        }

        public Guid GetPipelinesOfRepository(Guid organizationId, Guid repositoryId)
        {
            var ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            var message = new GetPipelinesRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                RepositoryId = repositoryId,
            };

            _getPipelinesRequestProducer.PublishMessage(message);

            _logger.LogDebug("GetPipelinesRequest Enqueued");

            return ticketId;
        }

        public Guid PostResourceToRepository(Guid organizationId, Guid repositoryId, string name, IFormFile resourceFile, string resourceType, Guid owner, string ownerType, Guid? userGroup)
        {
            var ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            using var stream = new MemoryStream();
            resourceFile.CopyTo(stream);

            var fileDTO = new FileDTO
            {
                Name = Path.GetFileNameWithoutExtension(resourceFile.FileName),
                Extension = Path.GetExtension(resourceFile.FileName),
                Content = stream.ToArray()
            };

            var message = new PostResourceRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                RepositoryId = repositoryId,
                Name = name,
                ResourceType = resourceType,
                File = fileDTO,
                Owner = owner,
                OwnerType = ownerType,
                UserGroup = userGroup
            };

            _postResourceRequestProducer.PublishMessage(message);

            _logger.LogDebug("PostResourceRequest Enqueued");

            return ticketId;
        }

        public Guid PostOperatorToRepository(Guid organizationId, Guid repositoryId, string name, IFormFile sourceCodeFile, IFormFile dockerfileFile, string resourceType, Guid owner, string ownerType, Guid? userGroup)
        {
            var ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            using var sourceCodeStream = new MemoryStream();
            using var dockerFileStream = new MemoryStream();
            sourceCodeFile.CopyTo(sourceCodeStream);
            dockerfileFile.CopyTo(dockerFileStream);

            var sourceCodeFileDTO = new FileDTO
            {
                Name = Path.GetFileNameWithoutExtension(sourceCodeFile.FileName),
                Extension = Path.GetExtension(sourceCodeFile.FileName),
                Content = sourceCodeStream.ToArray()
            };

            var dockerfileFileDTO = new FileDTO
            {
                Name = Path.GetFileNameWithoutExtension(dockerfileFile.FileName),
                Extension = Path.GetExtension(dockerfileFile.FileName),
                Content = dockerFileStream.ToArray()
            };

            var message = new PostOperatorRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                RepositoryId = repositoryId,
                Name = name,
                ResourceType = resourceType,
                SourceCodeFile = sourceCodeFileDTO,
                DockerfileFile = dockerfileFileDTO,
                Owner = owner,
                OwnerType = ownerType,
                UserGroup = userGroup
            };

            _postOperatorRequestProducer.PublishMessage(message);

            _logger.LogDebug("PostOperatorRequest Enqueued");

            return ticketId;
        }

        public Guid PostPipelineToRepository(Guid organizationId, Guid repositoryId, PipelineApiDto pipeline, Guid owner, string ownerType, Guid? userGroup)
        {
            var ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            var message = new PostPipelineRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                RepositoryId = repositoryId,
                Name = pipeline.Name,
                Pipeline = pipeline.Pipeline,
                Owner = owner,
                OwnerType = ownerType,
                UserGroup = userGroup
            };

            _postPipelineRequestProducer.PublishMessage(message);

            _logger.LogDebug("PostPipelineRequest Enqueued");

            return ticketId;
        }
    }
}
