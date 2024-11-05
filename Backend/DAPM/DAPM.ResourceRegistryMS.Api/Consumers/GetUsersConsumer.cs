using DAPM.ResourceRegistryMS.Api.Models;
using DAPM.ResourceRegistryMS.Api.Services;
using DAPM.ResourceRegistryMS.Api.Services.Interfaces;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;
using RabbitMQLibrary.Messages.ResourceRegistry;
using RabbitMQLibrary.Models;

namespace DAPM.ResourceRegistryMS.Api.Consumers
{
    public class GetUsersConsumer : IQueueConsumer<GetUsersMessage>
    {
        private ILogger<GetUsersConsumer> _logger;
        private IQueueProducer<GetUsersResultMessage> _getUsersResultQueueProducer;
        private IPeerService _peerService;
        private IUserService _userService;

        public GetUsersConsumer(
            ILogger<GetUsersConsumer> logger,
            IQueueProducer<GetUsersResultMessage> getUsersResultQueueProducer,
            IPeerService peerService,
            IUserService userService)
        {
            _logger = logger;
            _getUsersResultQueueProducer = getUsersResultQueueProducer;
            _peerService = peerService;
            _userService = userService;
        }

        public async Task ConsumeAsync(GetUsersMessage message)
        {
            _logger.LogInformation("GetUsersMessage received");

            var users = Enumerable.Empty<User>();

            if (message.UserId != null)
            {
                var user = await _userService.GetUserById(message.OrganizationId, (Guid)message.UserId);
                users = users.Append(user);
            }
            else
            {
                users = await _peerService.GetUsersOfOrganization(message.OrganizationId);
            }

            IEnumerable<UserDTO> usersDTOs = Enumerable.Empty<UserDTO>();

            foreach (var user in users)
            {
                var newUser = new UserDTO
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Password = user.Password,
                    Email = user.Email,
                    UserType = user.UserType,
                    UserStatus = user.UserStatus,
                    UserGroups = user.UserGroups,
                    OrganizationId = user.PeerId
                };

                usersDTOs = usersDTOs.Append(newUser);
            }

            var resultMessage = new GetUsersResultMessage
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                ProcessId = message.ProcessId,
                Users = usersDTOs
            };

            _getUsersResultQueueProducer.PublishMessage(resultMessage);

            return;
        }
    }
}
