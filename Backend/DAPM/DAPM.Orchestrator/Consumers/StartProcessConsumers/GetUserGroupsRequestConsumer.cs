using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;

namespace DAPM.Orchestrator.Consumers.StartProcessConsumers
{
    public class GetUserGroupsRequestConsumer : IQueueConsumer<GetUserGroupsRequest>
    {
        IOrchestratorEngine _engine;
        public GetUserGroupsRequestConsumer(IOrchestratorEngine engine)
        {
            _engine = engine;
        }
        public Task ConsumeAsync(GetUserGroupsRequest message, CancellationToken cancellationToken)
        {
            _engine.StartGetUserGroupsProcess(message.TicketId, message.OrganizationId, message.Id);
            return Task.CompletedTask;
        }
    }
}
