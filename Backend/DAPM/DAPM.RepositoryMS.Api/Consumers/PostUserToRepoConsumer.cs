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
    public class PostUserToRepoConsumer : IQueueConsumer<PostUserToRepoMessage>
    {
        private ILogger<PostUserToRepoConsumer> _logger;
        private IUserService _userService;
        IQueueProducer<PostUserToRepoResultMessage> _postUserToRepoResultProducer;

        public PostUserToRepoConsumer(ILogger<PostUserToRepoConsumer> logger, IUserService userService,
            IQueueProducer<PostUserToRepoResultMessage> postUserToRepoResultProducer) 
        {
            _logger = logger;
            _userService = userService;
            _postUserToRepoResultProducer = postUserToRepoResultProducer;
        }
        public async Task ConsumeAsync(PostUserToRepoMessage message)
        {
            _logger.LogInformation("PostUserToRepoMessage received");

            User user = ConvertUserDTOToUser(message.User);

            // Create the user in the database
            user = await _userService.CreateNewUser(user);

            // User user = await _userService.CreateNewUser(message.User);

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

            var postUserResult = new PostUserToRepoResultMessage
            {
                ProcessId = message.ProcessId,
                TimeToLive = TimeSpan.FromMinutes(1),
                User = userDTO,
                Succeeded = true,
                Message = "The user was created successfully"
            };

            _postUserToRepoResultProducer.PublishMessage(postUserResult);

            _logger.LogInformation("PostUserResultMessage produced");


            return;
        }

        private User ConvertUserDTOToUser(UserDTO userDTO)
        {
            return new User
            {
                UserId = userDTO.UserId != Guid.Empty ? userDTO.UserId : Guid.NewGuid(), // If Id is missing, generate a new one
                Username = userDTO.Username,
                // Fill in additional properties if available in UserDTO and required in User, e.g., Password, Email, etc.
                Password = userDTO.Password ?? "default", // Example placeholder if Password is not in UserDTO
                Email = userDTO.Email,
                UserType = userDTO.UserType ?? "default", // Placeholder, set as per requirements
                UserStatus = userDTO.UserStatus ?? "active", // Example default
                UserGroups = userDTO.UserGroups ?? new List<string>(),
                OrganizationId = userDTO.OrganizationId
            };
        }
    }
}
