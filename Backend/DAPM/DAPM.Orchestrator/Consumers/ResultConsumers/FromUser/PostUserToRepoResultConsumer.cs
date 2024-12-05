using DAPM.Orchestrator.Processes;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromUser;

namespace DAPM.Orchestrator.Consumers.ResultConsumers.FromUser
{
    public class PostUserToRepoResultConsumer : IQueueConsumer<PostUserToRepoResultMessage>
    {
        private IOrchestratorEngine _orchestratorEngine;

        public PostUserToRepoResultConsumer(IOrchestratorEngine orchestratorEngine)
        {
            _orchestratorEngine = orchestratorEngine;
        }

        public Task ConsumeAsync(PostUserToRepoResultMessage message, CancellationToken cancellationToken)
        {
            CreateUserProcess process = (CreateUserProcess)_orchestratorEngine.GetProcess(message.ProcessId);
            process.OnCreateUserInRepoResult(message);

            return Task.CompletedTask;
        }
    }
}
