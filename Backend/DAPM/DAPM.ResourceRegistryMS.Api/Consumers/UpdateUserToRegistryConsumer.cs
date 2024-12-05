using DAPM.ResourceRegistryMS.Api.Services.Interfaces;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.ClientApi;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;
using RabbitMQLibrary.Messages.ResourceRegistry;
using RabbitMQLibrary.Models;

namespace DAPM.ResourceRegistryMS.Api.Consumers
{
    public class UpdateUserToRegistryConsumer : IQueueConsumer<UpdateUserToRegistryMessage>
    {
        private ILogger<UpdateUserToRegistryConsumer> _logger;
        private IQueueProducer<UpdateUserToRegistryResultMessage> _updateUserToRegistryResultMessageProducer;
        private IPeerService _peerService;

        public UpdateUserToRegistryConsumer(ILogger<UpdateUserToRegistryConsumer> logger,
            IQueueProducer<UpdateUserToRegistryResultMessage> updateUserToRegistryResultMessageProducer,
            IPeerService peerService)
        {
            _logger = logger;
            _updateUserToRegistryResultMessageProducer = updateUserToRegistryResultMessageProducer;
            _peerService = peerService;
        }
        public async Task ConsumeAsync(UpdateUserToRegistryMessage message, CancellationToken cancellationToken)
        {
            _logger.LogInformation("UpdateUserToRegistryMessage received");

            var updatedUser = await _peerService.UpdateUserToOrganization(message.OrganizationId, message.UserId, message.UserGroups);
            if (updatedUser != null)
            {
                
                var resultMessage = new UpdateUserToRegistryResultMessage
                {
                    ProcessId = message.ProcessId,
                    TimeToLive = TimeSpan.FromMinutes(1),
                    Message = "User entry created successfully",
                    Succeeded = true,
                    UserId = message.UserId,
                    UserGroups = message.UserGroups,
                    OrganizationId = message.OrganizationId
                };

                _updateUserToRegistryResultMessageProducer.PublishMessage(resultMessage);
                _logger.LogInformation("UpdateUserToRegistryResultMessage published");
            }


            return;

        }
    }
}
