using DAPM.RepositoryMS.Api.Models.PostgreSQL;
using DAPM.RepositoryMS.Api.Services.Interfaces;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRepo;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromUser;
using RabbitMQLibrary.Messages.Repository;
using RabbitMQLibrary.Messages.User;
using RabbitMQLibrary.Models;

namespace DAPM.RepositoryMS.Api.Consumers
{
    public class UpdateUserToRepoConsumer : IQueueConsumer<UpdateUserToRepoMessage>
    {
        private ILogger<UpdateUserToRepoConsumer> _logger;
        private IUserService _userService;
        IQueueProducer<UpdateUserToRepoResultMessage> _updateUserToRepoResultProducer;

        public UpdateUserToRepoConsumer(ILogger<UpdateUserToRepoConsumer> logger, IUserService userService,
            IQueueProducer<UpdateUserToRepoResultMessage> updateUserToRepoResultProducer) 
        {
            _logger = logger;
            _userService = userService;
            _updateUserToRepoResultProducer = updateUserToRepoResultProducer;
        }
        public async Task ConsumeAsync(UpdateUserToRepoMessage message, CancellationToken cancellationToken)
        {
            _logger.LogInformation("UpdateUserToRepoMessage received");

            // Update user
            var user = await _userService.UpdateUser(message.UserId, message.UserGroups);

            UserDTO userDTO = new UserDTO
            {
                UserId = user.UserId,
                Username = user.Username,
                Password = user.Password,
                Email = user.Email,
                UserType = user.UserType,
                UserStatus = user.UserStatus,
                UserGroups = user.UserGroups,
                OrganizationId = user.OrganizationId
            };

            var updateUserResult = new UpdateUserToRepoResultMessage
            {
                ProcessId = message.ProcessId,
                TimeToLive = TimeSpan.FromMinutes(1),
                UserId = message.UserId,
                UserGroups = message.UserGroups,
                OrganizationId = message.OrganizationId,
                Succeeded = true,
                Message = "The user was update successfully"
            };

            _updateUserToRepoResultProducer.PublishMessage(updateUserResult);

            _logger.LogInformation("PostUserResultMessage produced");

            return;
        }
    }
}
