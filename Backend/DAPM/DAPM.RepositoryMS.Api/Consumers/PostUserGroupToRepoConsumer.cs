using DAPM.RepositoryMS.Api.Models.PostgreSQL;
using DAPM.RepositoryMS.Api.Services.Interfaces;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRepo;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromUser;
using RabbitMQLibrary.Messages.Repository;
using RabbitMQLibrary.Messages.User;
using RabbitMQLibrary.Messages.UserGroup;
using RabbitMQLibrary.Models;

namespace DAPM.RepositoryMS.Api.Consumers
{
    public class PostUserGroupToRepoConsumer : IQueueConsumer<PostUserGroupToRepoMessage>
    {
        private ILogger<PostUserGroupToRepoConsumer> _logger;
        private IUserService _userService;
        IQueueProducer<PostUserGroupToRepoResultMessage> _postUserGroupToRepoResultProducer;

        public PostUserGroupToRepoConsumer(ILogger<PostUserGroupToRepoConsumer> logger, IUserService userService,
            IQueueProducer<PostUserGroupToRepoResultMessage> postUserGroupToRepoResultProducer) 
        {
            _logger = logger;
            _userService = userService;
            _postUserGroupToRepoResultProducer = postUserGroupToRepoResultProducer;
        }
        public async Task ConsumeAsync(PostUserGroupToRepoMessage message)
        {
            _logger.LogInformation("PostUserGroupToRepoMessage received");

            UserGroup userGroup = await _userService.CreateNewUserGroup(message.UserGroup);

            UserGroupDTO userGroupDTO = new UserGroupDTO
            {
                Id = userGroup.Id,
                Name = userGroup.Name,
            };

            var postUserGroupToRepoResult = new PostUserGroupToRepoResultMessage
            {
                ProcessId = message.ProcessId,
                TimeToLive = TimeSpan.FromMinutes(1),
                UserGroup = userGroupDTO,
                Succeeded = true,
                Message = "The UserGroup was created successfully"
            };

            _postUserGroupToRepoResultProducer.PublishMessage(postUserGroupToRepoResult);

            _logger.LogInformation("PostUserGroupToRepoResultMessage produced");

            return;
        }
    }
}
