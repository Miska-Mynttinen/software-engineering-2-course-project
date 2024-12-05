using DAPM.Orchestrator.Processes;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;

namespace DAPM.Orchestrator.Consumers.ResultConsumers.FromRegistry
{
    public class GetUserGroupsFromRegistryResultConsumer : IQueueConsumer<GetUserGroupsResultMessage>
    {
        private IOrchestratorEngine _orchestratorEngine;

        public GetUserGroupsFromRegistryResultConsumer(IOrchestratorEngine orchestratorEngine)
        {
            _orchestratorEngine = orchestratorEngine;
        }

        public Task ConsumeAsync(GetUserGroupsResultMessage message, CancellationToken cancellationToken)
        {
            GetUserGroupsProcess process = (GetUserGroupsProcess)_orchestratorEngine.GetProcess(message.ProcessId);
            process.OnGetUserGroupsFromRegistryResult(message);

            return Task.CompletedTask;
        }
    }
}
