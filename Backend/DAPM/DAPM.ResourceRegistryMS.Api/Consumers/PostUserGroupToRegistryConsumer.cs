using DAPM.ResourceRegistryMS.Api.Services.Interfaces;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.ClientApi;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;
using RabbitMQLibrary.Messages.ResourceRegistry;
using RabbitMQLibrary.Models;

namespace DAPM.ResourceRegistryMS.Api.Consumers
{
    public class PostUserGroupToRegistryConsumer : IQueueConsumer<PostUserGroupToRegistryMessage>
    {
        private ILogger<PostUserGroupToRegistryConsumer> _logger;
        private IQueueProducer<PostUserGroupToRegistryResultMessage> _postUserGroupToRegistryResultMessageProducer;
        private IPeerService _peerService;

        public PostUserGroupToRegistryConsumer(ILogger<PostUserGroupToRegistryConsumer> logger,
            IQueueProducer<PostUserGroupToRegistryResultMessage> postUserGroupToRegistryResultMessageProducer,
            IPeerService peerService)
        {
            _logger = logger;
            _postUserGroupToRegistryResultMessageProducer = postUserGroupToRegistryResultMessageProducer;
            _peerService = peerService;
        }
        public async Task ConsumeAsync(PostUserGroupToRegistryMessage message, CancellationToken cancellationToken)
        {
            _logger.LogInformation("PostUserGroupToRegistryMessage received");


            var createdUserGroup = await _peerService.PostUserGroupToOrganization(message.UserGroup.OrganizationId, message.UserGroup);
            if (createdUserGroup != null)
            {
                var userGroupDto = new UserGroupDTO()
                {
                    Id = createdUserGroup.Id,
                    Name = createdUserGroup.Name,
                    OrganizationId = createdUserGroup.PeerId,
                };

                var resultMessage = new PostUserGroupToRegistryResultMessage
                {
                    ProcessId = message.ProcessId,
                    TimeToLive = TimeSpan.FromMinutes(1),
                    Message = "UserGroup entry created successfully",
                    Succeeded = true,
                    UserGroup = userGroupDto
                };

                _postUserGroupToRegistryResultMessageProducer.PublishMessage(resultMessage);
                _logger.LogInformation("PostUserGroupToRegistryResultMessage published");
            }


            return;

        }
    }
}
