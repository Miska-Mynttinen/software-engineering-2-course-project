using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;

namespace DAPM.Orchestrator.Consumers.StartProcessConsumers
{
    public class UpdateUserRequestConsumer : IQueueConsumer<UpdateUserRequest>
    {
        IOrchestratorEngine _engine;

        public UpdateUserRequestConsumer(IOrchestratorEngine engine)
        {
            _engine = engine;
        }

        public Task ConsumeAsync(UpdateUserRequest message)
        {
            _engine.StartUpdateUserProcess(message.TicketId, message.OrganizationId, message.UserId, message.UserGroups);
            return Task.CompletedTask;
        }
    }
}
