using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;
using RabbitMQLibrary.Messages.PipelineOrchestrator;

namespace DAPM.Orchestrator.Consumers.StartProcessConsumers
{
    public class PipelineStartCommandRequestConsumer : IQueueConsumer<PipelineStartCommandRequest>
    {
        IOrchestratorEngine _engine;

        public PipelineStartCommandRequestConsumer(IOrchestratorEngine engine)
        {
            _engine = engine;
        }
        public Task ConsumeAsync(PipelineStartCommandRequest message, CancellationToken cancellationToken)
        {
            _engine.StartPipelineStartCommandProcess(message.TicketId, message.ExecutionId);
            return Task.CompletedTask;
        }
    }
}
