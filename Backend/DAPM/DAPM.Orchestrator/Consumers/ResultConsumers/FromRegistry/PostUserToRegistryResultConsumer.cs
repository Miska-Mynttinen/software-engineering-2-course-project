using DAPM.Orchestrator.Processes;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;

namespace DAPM.Orchestrator.Consumers.ResultConsumers.FromRegistry
{
    public class PostUserToRegistryResultConsumer : IQueueConsumer<PostUserToRegistryResultMessage>
    {
        private IOrchestratorEngine _orchestratorEngine;

        public PostUserToRegistryResultConsumer(IOrchestratorEngine orchestratorEngine)
        {
            _orchestratorEngine = orchestratorEngine;
        }

        public Task ConsumeAsync(PostUserToRegistryResultMessage message)
        {
            CreateUserProcess process = (CreateUserProcess)_orchestratorEngine.GetProcess(message.ProcessId);
            process.OnPostUserToRegistryResult(message);

            return Task.CompletedTask;
        }
    }
}
