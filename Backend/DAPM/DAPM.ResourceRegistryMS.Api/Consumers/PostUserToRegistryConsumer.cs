using DAPM.ResourceRegistryMS.Api.Services.Interfaces;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.ClientApi;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;
using RabbitMQLibrary.Messages.ResourceRegistry;
using RabbitMQLibrary.Models;

namespace DAPM.ResourceRegistryMS.Api.Consumers
{
    public class PostUserToRegistryConsumer : IQueueConsumer<PostUserToRegistryMessage>
    {
        private ILogger<PostUserToRegistryConsumer> _logger;
        private IQueueProducer<PostUserToRegistryResultMessage> _postUserToRegistryResultMessageProducer;
        private IPeerService _peerService;

        public PostUserToRegistryConsumer(ILogger<PostUserToRegistryConsumer> logger,
            IQueueProducer<PostUserToRegistryResultMessage> postUserToRegistryResultMessageProducer,
            IPeerService peerService)
        {
            _logger = logger;
            _postUserToRegistryResultMessageProducer = postUserToRegistryResultMessageProducer;
            _peerService = peerService;
        }
        public async Task ConsumeAsync(PostUserToRegistryMessage message, CancellationToken cancellationToken)
        {
            _logger.LogInformation("PostUserToRegistryMessage received");


            var createdUser = await _peerService.PostUserToOrganization(message.User.OrganizationId, message.User);
            if (createdUser != null)
            {
                var userDto = new UserDTO()
                {
                    UserId = createdUser.UserId,
                    Username = createdUser.Username,
                    Password = createdUser.Password,
                    Email = createdUser.Email,
                    UserType = createdUser.UserType,
                    UserStatus = createdUser.UserStatus,
                    UserGroups = createdUser.UserGroups,
                    OrganizationId = createdUser.PeerId,
                };

                var resultMessage = new PostUserToRegistryResultMessage
                {
                    ProcessId = message.ProcessId,
                    TimeToLive = TimeSpan.FromMinutes(1),
                    Message = "User entry created successfully",
                    Succeeded = true,
                    User = userDto
                };

                _postUserToRegistryResultMessageProducer.PublishMessage(resultMessage);
                _logger.LogInformation("PostUserToRegistryResultMessage published");
            }


            return;

        }
    }
}
