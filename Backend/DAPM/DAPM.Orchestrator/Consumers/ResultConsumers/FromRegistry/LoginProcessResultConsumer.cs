using DAPM.Orchestrator.Processes;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;

namespace DAPM.Orchestrator.Consumers.ResultConsumers.FromRegistry
{
    public class LoginProcessResultConsumer : IQueueConsumer<LoginProcessResultMessage>
    {
        private readonly IOrchestratorEngine _orchestratorEngine;

        public LoginProcessResultConsumer(IOrchestratorEngine orchestratorEngine)
        {
            _orchestratorEngine = orchestratorEngine;
        }

        public Task ConsumeAsync(LoginProcessResultMessage message)
        {
            // Retrieve the corresponding LoginProcess using ProcessId from the message
            var process = (LoginProcess)_orchestratorEngine.GetProcess(message.ProcessId);
            
            // Forward the result to the process to handle
            process.OnLoginResult(message);

            return Task.CompletedTask;
        }
    }
}
