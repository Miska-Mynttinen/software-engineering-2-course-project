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
    public class GetUserGroupsProcessResultConsumer : IQueueConsumer<GetUserGroupsProcessResult>
    {
        private ILogger<GetUserGroupsProcessResultConsumer> _logger;
        private readonly ITicketService _ticketService;
        public GetUserGroupsProcessResultConsumer(ILogger<GetUserGroupsProcessResultConsumer> logger, ITicketService ticketService)
        {
            _logger = logger;
            _ticketService = ticketService;
        }

        public Task ConsumeAsync(GetUserGroupsProcessResult message, CancellationToken cancellationToken)
        {
            _logger.LogInformation("GetUserGroupsProcessResult received");


            IEnumerable<UserGroupDTO> userGroupsDTOs = message.UserGroups;

            // Objects used for serialization
            JToken result = new JObject();
            JsonSerializer serializer = JsonSerializer.Create(new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });


            //Serialization
            JToken userGroupsJSON = JToken.FromObject(userGroupsDTOs, serializer);
            result["userGroups"] = userGroupsJSON;


            // Update resolution
            _ticketService.UpdateTicketResolution(message.TicketId, result);

            return Task.CompletedTask;
        }
    }
}
