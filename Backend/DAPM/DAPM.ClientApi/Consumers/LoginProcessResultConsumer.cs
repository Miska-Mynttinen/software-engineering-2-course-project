using DAPM.ClientApi.Services.Interfaces;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Models;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults;
using RabbitMQLibrary.Messages.ClientApi;
namespace DAPM.ClientApi.Consumers
{
    public class LoginProcessResultConsumer : IQueueConsumer<LoginProcessResult>
     {
        private readonly ILogger<LoginProcessResultConsumer> _logger;
        private readonly ITicketService _ticketService;

        public LoginProcessResultConsumer(ILogger<LoginProcessResultConsumer> logger, ITicketService ticketService)
        {
            _logger = logger;
            _ticketService = ticketService;
        }

        public Task ConsumeAsync(LoginProcessResult message)
        {
            _logger.LogInformation($"Processing login result for ticket: {message.TicketId}, username: {message.Username}");

            // Ensure the TicketId is valid (convert to Guid)
            Guid ticketId = GetValidTicketId(message.TicketId);

            // Validate the credentials (for example, non-empty username and password)
            bool isValid = ValidateCredentials(message.Username, message.Password);

            // Prepare the result as a JToken
            JToken result = PrepareLoginResult(isValid, message.Username);

            // Update the ticket resolution with the result
            _ticketService.UpdateTicketResolution(ticketId, result);

            return Task.CompletedTask;
        }

        private Guid GetValidTicketId(Guid ticketId)
        {
            // You can directly use the ticketId, no need to parse it again
            if (ticketId == Guid.Empty)  // Check if the Guid is empty (invalid)
            {
                return Guid.NewGuid();  // Generate a new GUID if invalid
            }

            return ticketId;  // Otherwise, return the provided ticketId
        }


        private bool ValidateCredentials(string username, string password)
        {
            return !string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password);
        }

        private JToken PrepareLoginResult(bool isValid, string username)
        {
            return JObject.FromObject(new
            {
                success = isValid,
                username = username
            });
        }
    }
}
