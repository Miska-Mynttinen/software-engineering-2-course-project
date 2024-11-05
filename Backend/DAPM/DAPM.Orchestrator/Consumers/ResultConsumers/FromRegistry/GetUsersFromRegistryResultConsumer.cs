using DAPM.Orchestrator.Processes;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;

namespace DAPM.Orchestrator.Consumers.ResultConsumers.FromRegistry
{
    public class GetUsersFromRegistryResultConsumer : IQueueConsumer<GetUsersResultMessage>
    {
        private IOrchestratorEngine _orchestratorEngine;

        public GetUsersFromRegistryResultConsumer(IOrchestratorEngine orchestratorEngine)
        {
            _orchestratorEngine = orchestratorEngine;
        }

        public Task ConsumeAsync(GetUsersResultMessage message)
        {
            GetUsersProcess process = (GetUsersProcess)_orchestratorEngine.GetProcess(message.ProcessId);
            process.OnGetUsersFromRegistryResult(message);

            return Task.CompletedTask;
        }
    }
}
