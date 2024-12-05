using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;
using System.Threading;
using System.Threading.Tasks;

namespace DAPM.Orchestrator.Consumers.StartProcessConsumers
{
    public class GetResourceFilesRequestConsumer : IQueueConsumer<GetResourceFilesRequest>
    {
        private readonly IOrchestratorEngine _engine;

        public GetResourceFilesRequestConsumer(IOrchestratorEngine engine)
        {
            _engine = engine;
        }

        public Task ConsumeAsync(GetResourceFilesRequest message, CancellationToken cancellationToken)
        {
            // Start the GetResourceFiles process with the required parameters
            _engine.StartGetResourceFilesProcess(
                message.TicketId,
                message.OrganizationId,
                message.RepositoryId,
                message.ResourceId);

            return Task.CompletedTask;
        }
    }
}
