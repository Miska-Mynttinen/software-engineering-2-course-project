
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.ClientApi;
using RabbitMQLibrary.Messages.ResourceRegistry;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;

namespace DAPM.Orchestrator.Processes
{
    public class GetUsersProcess : OrchestratorProcess
    {
        private Guid _organizationId;
        private Guid? _userId;
        private Guid _ticketId;
        public GetUsersProcess(OrchestratorEngine engine, IServiceProvider serviceProvider, Guid ticketId, Guid processId, Guid organizationId, Guid? userId) 
            : base(engine, serviceProvider, processId)
        {
            _organizationId = organizationId;
            _userId = userId;

            _ticketId = ticketId;
        }

        public override void StartProcess()
        {
            var getUsersProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<GetUsersMessage>>();

            var message = new GetUsersMessage()
            {
                ProcessId = _processId,
                TimeToLive = TimeSpan.FromMinutes(1),
                OrganizationId = _organizationId,
                UserId = _userId
            };

            getUsersProducer.PublishMessage(message);
        }

        public override void OnGetUsersFromRegistryResult(GetUsersResultMessage message)
        {

            var getUsersProcessResultProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<GetUsersProcessResult>>();

            var processResultMessage = new GetUsersProcessResult()
            {
                TicketId = _ticketId,
                TimeToLive = TimeSpan.FromMinutes(1),
                Users = message.Users
            };

            getUsersProcessResultProducer.PublishMessage(processResultMessage);

            EndProcess();

        }
    }
}
