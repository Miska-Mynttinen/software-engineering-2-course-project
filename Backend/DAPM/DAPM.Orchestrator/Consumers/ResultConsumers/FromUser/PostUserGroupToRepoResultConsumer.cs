using DAPM.Orchestrator.Processes;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromUser;

namespace DAPM.Orchestrator.Consumers.ResultConsumers.FromUser
{
    public class PostUserGroupToRepoResultConsumer : IQueueConsumer<PostUserGroupToRepoResultMessage>
    {
        private IOrchestratorEngine _orchestratorEngine;

        public PostUserGroupToRepoResultConsumer(IOrchestratorEngine orchestratorEngine)
        {
            _orchestratorEngine = orchestratorEngine;
        }

        public Task ConsumeAsync(PostUserGroupToRepoResultMessage message, CancellationToken cancellationToken)
        {
            CreateUserGroupProcess process = (CreateUserGroupProcess)_orchestratorEngine.GetProcess(message.ProcessId);
            process.OnCreateUserGroupInRepoResult(message);

            return Task.CompletedTask;
        }
    }
}
