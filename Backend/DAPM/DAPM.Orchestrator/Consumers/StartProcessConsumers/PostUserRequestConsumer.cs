using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;

namespace DAPM.Orchestrator.Consumers.StartProcessConsumers
{
    public class PostUserRequestConsumer : IQueueConsumer<PostUserRequest>
    {
        IOrchestratorEngine _engine;

        public PostUserRequestConsumer(IOrchestratorEngine engine)
        {
            _engine = engine;
        }

        public Task ConsumeAsync(PostUserRequest message)
        {
            _engine.StartCreateUserProcess(message.TicketId, message.OrganizationId, message.User);
            return Task.CompletedTask;
        }
    }
}
