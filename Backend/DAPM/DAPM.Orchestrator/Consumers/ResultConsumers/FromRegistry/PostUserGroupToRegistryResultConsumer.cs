using DAPM.Orchestrator.Processes;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;

namespace DAPM.Orchestrator.Consumers.ResultConsumers.FromRegistry
{
    public class PostUserGroupToRegistryResultConsumer : IQueueConsumer<PostUserGroupToRegistryResultMessage>
    {
        private IOrchestratorEngine _orchestratorEngine;

        public PostUserGroupToRegistryResultConsumer(IOrchestratorEngine orchestratorEngine)
        {
            _orchestratorEngine = orchestratorEngine;
        }

        public Task ConsumeAsync(PostUserGroupToRegistryResultMessage message, CancellationToken cancellationToken)
        {
            CreateUserGroupProcess process = (CreateUserGroupProcess)_orchestratorEngine.GetProcess(message.ProcessId);
            process.OnPostUserGroupToRegistryResult(message);

            return Task.CompletedTask;
        }
    }
}
