using DAPM.Orchestrator.Processes;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;

namespace DAPM.Orchestrator.Consumers.ResultConsumers.FromRegistry
{
    public class UpdateUserToRegistryResultConsumer : IQueueConsumer<UpdateUserToRegistryResultMessage>
    {
        private IOrchestratorEngine _orchestratorEngine;

        public UpdateUserToRegistryResultConsumer(IOrchestratorEngine orchestratorEngine)
        {
            _orchestratorEngine = orchestratorEngine;
        }

        public Task ConsumeAsync(UpdateUserToRegistryResultMessage message)
        {
            CreateUserProcess process = (CreateUserProcess)_orchestratorEngine.GetProcess(message.ProcessId);
            process.OnUpdateUserToRegistryResult(message);

            return Task.CompletedTask;
        }
    }
}
