using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;

namespace DAPM.Orchestrator.Consumers.StartProcessConsumers
{
    public class CreatePipelineExecutionRequestConsumer : IQueueConsumer<CreatePipelineExecutionRequest>
    {
        IOrchestratorEngine _engine;

        public CreatePipelineExecutionRequestConsumer(IOrchestratorEngine engine)
        {
            _engine = engine;
        }

        public Task ConsumeAsync(CreatePipelineExecutionRequest message, CancellationToken cancellationToken)
        {
            _engine.StartCreatePipelineExecutionProcess(message.TicketId, message.OrganizationId, message.RepositoryId, message.PipelineId);
            return Task.CompletedTask;
        }
    }
}
