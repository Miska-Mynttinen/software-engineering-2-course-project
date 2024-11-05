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
    public class GetUsersProcessResultConsumer : IQueueConsumer<GetUsersProcessResult>
    {
        private ILogger<GetUsersProcessResultConsumer> _logger;
        private readonly ITicketService _ticketService;
        public GetUsersProcessResultConsumer(ILogger<GetUsersProcessResultConsumer> logger, ITicketService ticketService)
        {
            _logger = logger;
            _ticketService = ticketService;
        }

        public Task ConsumeAsync(GetUsersProcessResult message)
        {
            _logger.LogInformation("GetUsersProcessResult received");


            IEnumerable<UserDTO> usersDTOs = message.Users;

            // Objects used for serialization
            JToken result = new JObject();
            JsonSerializer serializer = JsonSerializer.Create(new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });


            //Serialization
            JToken usersJSON = JToken.FromObject(usersDTOs, serializer);
            result["users"] = usersJSON;


            // Update resolution
            _ticketService.UpdateTicketResolution(message.TicketId, result);

            return Task.CompletedTask;
        }
    }
}
