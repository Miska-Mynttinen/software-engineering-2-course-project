using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.ClientApi;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;

namespace DAPM.Orchestrator.Processes
{
    public class LoginProcess : OrchestratorProcess
    {
        private Guid _ticketId;
        private string _username;
        private string _password;
        private Guid _orgId;

        public LoginProcess(
            OrchestratorEngine engine, 
            IServiceProvider serviceProvider, 
            Guid ticketId, 
            Guid orgId, 
            Guid processId, 
            string username, 
            string password
        ) : base(engine, serviceProvider, processId)
        {
            _ticketId = ticketId;
            _orgId = orgId;
            _username = username;
            _password = password;
        }

        public override void StartProcess()
        {
            var loginProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<LoginMessage>>();

            var message = new LoginMessage()
            {
                ProcessId = _processId,
                TimeToLive = TimeSpan.FromMinutes(1),
                Username = _username,
                Password = _password,
                OrgId = _orgId
            };

            loginProducer.PublishMessage(message);
        }

        public override void OnLoginResult(LoginProcessResultMessage message)
        {
            var loginProcessResultProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<LoginProcessResult>>();

            var processResultMessage = new LoginProcessResult()
            {
                TicketId = _ticketId,
                MessageId = message.MessageId, // Assuming the message has a MessageId
                TimeToLive = TimeSpan.FromMinutes(1), // Assuming you want to set a TTL
                Username = message.Username,
                Password = _password, // You may want to hash or mask this in production environments
                OrgId = _orgId
            };

            loginProcessResultProducer.PublishMessage(processResultMessage);

            EndProcess();
        }
    }
}
