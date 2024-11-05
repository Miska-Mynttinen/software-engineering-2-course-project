using DAPM.Orchestrator.Processes;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromUser;

namespace DAPM.Orchestrator.Consumers.ResultConsumers.FromUser
{
    public class UpdateUserToRepoResultConsumer : IQueueConsumer<UpdateUserToRepoResultMessage>
    {
        private IOrchestratorEngine _orchestratorEngine;

        public UpdateUserToRepoResultConsumer(IOrchestratorEngine orchestratorEngine)
        {
            _orchestratorEngine = orchestratorEngine;
        }

        public Task ConsumeAsync(UpdateUserToRepoResultMessage message)
        {
            UpdateUserProcess process = (UpdateUserProcess)_orchestratorEngine.GetProcess(message.ProcessId);
            process.OnUpdateUserInRepoResult(message);

            return Task.CompletedTask;
        }
    }
}
