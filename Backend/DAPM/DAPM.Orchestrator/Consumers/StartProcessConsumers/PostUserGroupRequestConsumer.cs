using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;

namespace DAPM.Orchestrator.Consumers.StartProcessConsumers
{
    public class PostUserGroupRequestConsumer : IQueueConsumer<PostUserGroupRequest>
    {
        IOrchestratorEngine _engine;

        public PostUserGroupRequestConsumer(IOrchestratorEngine engine)
        {
            _engine = engine;
        }

        public Task ConsumeAsync(PostUserGroupRequest message)
        {
            _engine.StartCreateUserGroupProcess(message.TicketId, message.OrganizationId, message.Name);
            return Task.CompletedTask;
        }
    }
}
