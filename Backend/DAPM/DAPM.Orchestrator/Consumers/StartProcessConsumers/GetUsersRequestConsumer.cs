using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;

namespace DAPM.Orchestrator.Consumers.StartProcessConsumers
{
    public class GetUsersRequestConsumer : IQueueConsumer<GetUsersRequest>
    {
        IOrchestratorEngine _engine;
        public GetUsersRequestConsumer(IOrchestratorEngine engine)
        {
            _engine = engine;
        }
        public Task ConsumeAsync(GetUsersRequest message)
        {
            _engine.StartGetUsersProcess(message.TicketId, message.OrganizationId, message.UserId);
            return Task.CompletedTask;
        }
    }
}
