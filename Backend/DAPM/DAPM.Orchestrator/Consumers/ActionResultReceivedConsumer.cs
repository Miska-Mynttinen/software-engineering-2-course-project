using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.Other;

namespace DAPM.Orchestrator.Consumers
{
    public class ActionResultReceivedConsumer : IQueueConsumer<ActionResultReceivedMessage>
    {
        private ILogger<ActionResultReceivedConsumer> _logger;
        IOrchestratorEngine _engine;

        public ActionResultReceivedConsumer(IOrchestratorEngine engine, ILogger<ActionResultReceivedConsumer> logger)
        {
            _engine = engine;
            _logger = logger;
        }


        public Task ConsumeAsync(ActionResultReceivedMessage message)
        {
            // _logger.LogInformation("ConsumeAsync ActionResultReceivedMessage " + message.ProcessId);
            
            OrchestratorProcess process = _engine.GetProcess(message.ProcessId);
            process.OnActionResultFromPeer(message);
            return Task.CompletedTask;
        }
    }
}
