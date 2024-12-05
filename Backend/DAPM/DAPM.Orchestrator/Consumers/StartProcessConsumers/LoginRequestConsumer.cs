using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;

namespace DAPM.Orchestrator.Consumers.StartProcessConsumers
{
    public class LoginRequestConsumer : IQueueConsumer<LoginRequest>
    {
        private readonly IOrchestratorEngine _engine;

        public LoginRequestConsumer(IOrchestratorEngine engine)
        {
            _engine = engine;
        }

        public Task ConsumeAsync(LoginRequest message)
        {
            // Start the login process using the orchestrator engine
            _engine.StartLoginProcess(message.TicketId, message.Username, message.Password,message.OrgId);
            return Task.CompletedTask;
        }
    }
}
