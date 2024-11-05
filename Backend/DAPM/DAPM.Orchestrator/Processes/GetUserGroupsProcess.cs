
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.ClientApi;
using RabbitMQLibrary.Messages.ResourceRegistry;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;

namespace DAPM.Orchestrator.Processes
{
    public class GetUserGroupsProcess : OrchestratorProcess
    {
        private Guid _organizationId;
        private Guid? _id;
        private Guid _ticketId;
        public GetUserGroupsProcess(OrchestratorEngine engine, IServiceProvider serviceProvider, Guid ticketId, Guid processId, Guid organizationId, Guid? id) 
            : base(engine, serviceProvider, processId)
        {
            _organizationId = organizationId;
            _id = id;

            _ticketId = ticketId;
        }

        public override void StartProcess()
        {
            var getUserGroupsProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<GetUserGroupsMessage>>();

            var message = new GetUserGroupsMessage()
            {
                ProcessId = _processId,
                TimeToLive = TimeSpan.FromMinutes(1),
                OrganizationId = _organizationId,
                Id = _id
            };

            getUserGroupsProducer.PublishMessage(message);
        }

        public override void OnGetUserGroupsFromRegistryResult(GetUserGroupsResultMessage message)
        {

            var getUserGroupsProcessResultProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<GetUserGroupsProcessResult>>();

            var processResultMessage = new GetUserGroupsProcessResult()
            {
                TicketId = _ticketId,
                TimeToLive = TimeSpan.FromMinutes(1),
                UserGroups = message.UserGroups
            };

            getUserGroupsProcessResultProducer.PublishMessage(processResultMessage);

            EndProcess();

        }
    }
}
