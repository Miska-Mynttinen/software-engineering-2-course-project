using DAPM.ResourceRegistryMS.Api.Models;
using DAPM.ResourceRegistryMS.Api.Services;
using DAPM.ResourceRegistryMS.Api.Services.Interfaces;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;
using RabbitMQLibrary.Messages.ResourceRegistry;
using RabbitMQLibrary.Models;

namespace DAPM.ResourceRegistryMS.Api.Consumers
{
    public class GetUserGroupsConsumer : IQueueConsumer<GetUserGroupsMessage>
    {
        private ILogger<GetUserGroupsConsumer> _logger;
        private IQueueProducer<GetUserGroupsResultMessage> _getUserGroupsResultQueueProducer;
        private IPeerService _peerService;
        private IUserService _userService;

        public GetUserGroupsConsumer(
            ILogger<GetUserGroupsConsumer> logger,
            IQueueProducer<GetUserGroupsResultMessage> getUserGroupsResultQueueProducer,
            IPeerService peerService,
            IUserService userService)
        {
            _logger = logger;
            _getUserGroupsResultQueueProducer = getUserGroupsResultQueueProducer;
            _peerService = peerService;
            _userService = userService;
        }

        public async Task ConsumeAsync(GetUserGroupsMessage message)
        {
            _logger.LogInformation("GetUserGroupsMessage received");

            var userGroups = Enumerable.Empty<UserGroup>();

            if (message.Id != null)
            {
                var userGroup = await _userService.GetUserGroupById(message.OrganizationId, (Guid)message.Id);
                userGroups = userGroups.Append(userGroup);
            }
            else
            {
                userGroups = await _peerService.GetUserGroupsOfOrganization(message.OrganizationId);
            }

            IEnumerable<UserGroupDTO> UserGroupsDTOs = Enumerable.Empty<UserGroupDTO>();

            foreach (var userGroup in userGroups)
            {
                var newUserGroup = new UserGroupDTO
                {
                    Id = userGroup.Id,
                    Name = userGroup.Name,
                    OrganizationId = userGroup.PeerId
                };

                UserGroupsDTOs = UserGroupsDTOs.Append(newUserGroup);
            }

            var resultMessage = new GetUserGroupsResultMessage
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                ProcessId = message.ProcessId,
                UserGroups = UserGroupsDTOs
            };

            _getUserGroupsResultQueueProducer.PublishMessage(resultMessage);

            return;
        }
    }
}
