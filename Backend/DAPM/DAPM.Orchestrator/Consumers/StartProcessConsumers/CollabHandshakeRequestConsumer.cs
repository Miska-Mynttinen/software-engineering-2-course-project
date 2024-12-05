using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;

namespace DAPM.Orchestrator.Consumers.StartProcessConsumers
{
    public class CollabHandshakeRequestConsumer : IQueueConsumer<CollabHandshakeRequest>
    {
        IOrchestratorEngine _engine;

        public CollabHandshakeRequestConsumer(IOrchestratorEngine engine)
        {
            _engine = engine;
        }

        public Task ConsumeAsync(CollabHandshakeRequest message, CancellationToken cancellationToken)
        {
            _engine.StartCollabHandshakeProcess(message.TicketId, message.RequestedPeerDomain);
            return Task.CompletedTask;
        }
    }
}
