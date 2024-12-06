using DAPM.ResourceRegistryMS.Api.Models;
using DAPM.ResourceRegistryMS.Api.Services.Interfaces;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.ClientApi;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;
using RabbitMQLibrary.Models;

namespace DAPM.ResourceRegistryMS.Api.Consumers
{
    public class LoginConsumer : IQueueConsumer<LoginMessage>
    {
        private readonly ILogger<LoginConsumer> _logger;
        private readonly IPeerService _peerService; // Service to interact with Registry
        private readonly IQueueProducer<LoginProcessResultMessage> _loginResultQueueProducer;
        private IUserService _userService;

        public LoginConsumer(
            ILogger<LoginConsumer> logger,
            IPeerService peerService,
            IUserService userService,
            IQueueProducer<LoginProcessResultMessage> loginResultQueueProducer)
        {
            _logger = logger;
            _peerService = peerService;
            _loginResultQueueProducer = loginResultQueueProducer;
            _userService = userService;
        }

        public async Task ConsumeAsync(LoginMessage message)
        {
            _logger.LogInformation($"Processing Login Message for username: {message.Username}");
            bool success = false;
            var users = Enumerable.Empty<User>();

            if (message.Username != null)
            {
                var user = await _userService.UserLogin((Guid)message.OrgId, message.Username,message.Password);
                users = users.Append(user);
                
            }
            else
            {
                users = await _peerService.GetUsersOfOrganization(message.OrgId);
            }

            var usertype = "";
            foreach (var user in users)
            {
                if(user.Username== message.Username && user.Password == message.Password && user.PeerId == (Guid)message.OrgId){
                    success = true;
                    usertype = user.UserType;
                }
            }
            _logger.LogInformation($"--------------------Processing Login Message for username: {message.Username}-------------------------------------");
            // Prepare the result message
            var resultMessage = new LoginProcessResultMessage
            {
                ProcessId = message.ProcessId,
                Succeeded = success,
                Username = message.Username,
                OrgId = message.OrgId,
                Message = success ? "Login successful" : "Invalid username or password",
                UserType = usertype,
                TimeToLive = TimeSpan.FromMinutes(1)
            };

            // Publish the result message to the queue
            _loginResultQueueProducer.PublishMessage(resultMessage);
        }
    }
}
