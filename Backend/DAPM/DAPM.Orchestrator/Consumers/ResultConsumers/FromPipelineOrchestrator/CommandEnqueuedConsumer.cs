using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromPipelineOrchestrator;

namespace DAPM.Orchestrator.Consumers.ResultConsumers.FromPipelineOrchestrator
{
    public class CommandEnqueuedConsumer : IQueueConsumer<CommandEnqueuedMessage>
    {
        private ILogger<CommandEnqueuedConsumer> _logger;
        private IOrchestratorEngine _orchestratorEngine;

        public CommandEnqueuedConsumer(IOrchestratorEngine orchestratorEngine, ILogger<CommandEnqueuedConsumer> logger)
        {
            _logger = logger;
            _orchestratorEngine = orchestratorEngine;
        }

        public Task ConsumeAsync(CommandEnqueuedMessage message)
        {

            Task.Delay(TimeSpan.FromSeconds(60));
            
            _logger.LogInformation("message ConsumeAsync(CommandEnqueuedMessage1: " + message.ProcessId.ToString());
            _logger.LogInformation("message ConsumeAsync(CommandEnqueuedMessage2: " + message.MessageId.ToString());
            Dictionary<Guid, OrchestratorProcess>  processes = _orchestratorEngine.GetProcessesDictionary();
            // Loop through the dictionary and log each Guid and corresponding OrchestratorProcess
            foreach (var kvp in processes)
            {
                _logger.LogInformation("Process Guid: " + kvp.Key.ToString() + " | OrchestratorProcess: " + kvp.Value.ToString());
            }
            OrchestratorProcess process = _orchestratorEngine.GetProcess(message.ProcessId);
            process.OnCommandEnqueued(message);

            return Task.CompletedTask;
        }
    }
}
