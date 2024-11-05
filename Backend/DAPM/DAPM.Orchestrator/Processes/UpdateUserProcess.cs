using DAPM.Orchestrator.Services;
using DAPM.Orchestrator.Services.Models;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.ClientApi;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromPeerApi;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry;
// using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRepo;
using RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromUser;
using RabbitMQLibrary.Messages.PeerApi;
// using RabbitMQLibrary.Messages.Repository;
using RabbitMQLibrary.Messages.User;
using RabbitMQLibrary.Messages.ResourceRegistry;
using RabbitMQLibrary.Models;

namespace DAPM.Orchestrator.Processes
{
    public class UpdateUserProcess : OrchestratorProcess
    {
        private Guid _organizationId;
        private Guid _userId;
        private List<string> _userGroups;
        private Guid? _updatedUserId;
        private Guid? _updatedUserOrganizationId;

        private Dictionary<Guid, bool> _isRegistryUpdateCompleted;
        private int _registryUpdatesNotCompletedCounter;

        private Guid _ticketId;
        public UpdateUserProcess(OrchestratorEngine engine, IServiceProvider serviceProvider, Guid ticketId, Guid processId,
            Guid organizationId, Guid userId, List<string> userGroups) 
            : base(engine, serviceProvider, processId)
        {
            _organizationId = organizationId;
            _userId = userId;
            _userGroups = userGroups;
            _registryUpdatesNotCompletedCounter = 0;
            _isRegistryUpdateCompleted = new Dictionary<Guid, bool>();
            _ticketId = ticketId;
        }

        public override void StartProcess()
        {
            var updateUserToRepoProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<UpdateUserToRepoMessage>>();

            var message = new UpdateUserToRepoMessage()
            {
                ProcessId = _processId,
                TimeToLive = TimeSpan.FromMinutes(1),
                UserId = _userId,
                UserGroups = _userGroups,
                OrganizationId = _organizationId
            };

            updateUserToRepoProducer.PublishMessage(message);
        }

        public override void OnUpdateUserInRepoResult(UpdateUserToRepoResultMessage message)
        {
            var updateUserToRegistryProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<UpdateUserToRegistryMessage>>();

            message.OrganizationId = _organizationId;

            var updateUserToRegistryMessage = new UpdateUserToRegistryMessage()
            {
                ProcessId = _processId,
                TimeToLive = TimeSpan.FromMinutes(1),
                UserId = message.UserId,
                UserGroups = message.UserGroups,
                OrganizationId = message.OrganizationId
            };

            updateUserToRegistryProducer.PublishMessage(updateUserToRegistryMessage);
        }

        public override void OnUpdateUserToRegistryResult(UpdateUserToRegistryResultMessage message)
        {
            _updatedUserId = message.UserId;
            _updatedUserOrganizationId = message.OrganizationId;

            var getOrganizationsProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<GetOrganizationsMessage>>();

            var getOrganizationsMessage = new GetOrganizationsMessage()
            {
                ProcessId = _processId,
                TimeToLive = TimeSpan.FromMinutes(1),
                OrganizationId = null
            };

            getOrganizationsProducer.PublishMessage(getOrganizationsMessage);
        }

        public override void OnGetOrganizationsFromRegistryResult(GetOrganizationsResultMessage message)
        {

            var targetOrganizations = message.Organizations;

            SendRegistryUpdates(targetOrganizations,
                Enumerable.Empty<OrganizationDTO>(),
                Enumerable.Empty<RepositoryDTO>(),
                Enumerable.Empty<ResourceDTO>(),
                Enumerable.Empty<PipelineDTO>(),
                Enumerable.Empty<UserDTO>(),
                Enumerable.Empty<UserGroupDTO>()
                );
            

        }

        private void SendRegistryUpdates(IEnumerable<OrganizationDTO> targetOrganizations, IEnumerable<OrganizationDTO> organizations,
            IEnumerable<RepositoryDTO> repositories, IEnumerable<ResourceDTO> resources, IEnumerable<PipelineDTO> pipelines, IEnumerable<UserDTO> users, IEnumerable<UserGroupDTO> userGroups)
        {

            var sendRegistryUpdateProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<SendRegistryUpdateMessage>>();
            var identityDTO = new IdentityDTO()
            {
                Domain = _localPeerIdentity.Domain,
                Id = _localPeerIdentity.Id,
                Name = _localPeerIdentity.Name,
            };

            var registryUpdate = new RegistryUpdateDTO()
            {
                Organizations = organizations,
                Repositories = repositories,
                Pipelines = pipelines,
                Resources = resources,
                Users = users,
            };


            var registryUpdateMessages = new List<SendRegistryUpdateMessage>();

            foreach (var organization in targetOrganizations)
            {

                if (organization.Id == _localPeerIdentity.Id)
                    continue;

                var domain = organization.Domain;
                var registryUpdateMessage = new SendRegistryUpdateMessage()
                {
                    TargetPeerDomain = domain,
                    SenderPeerIdentity = identityDTO,
                    SenderProcessId = _processId,
                    TimeToLive = TimeSpan.FromMinutes(1),
                    RegistryUpdate = registryUpdate,
                    IsPartOfHandshake = false,
                };

                registryUpdateMessages.Add(registryUpdateMessage);
                _isRegistryUpdateCompleted[organization.Id] = false;
                _registryUpdatesNotCompletedCounter++;
            }

            if (registryUpdateMessages.Count() == 0)
            {
                FinishProcess();
            }
            else
            {
                foreach (var message in registryUpdateMessages)
                    sendRegistryUpdateProducer.PublishMessage(message);
            }

        }

        public override void OnRegistryUpdateAck(RegistryUpdateAckMessage message)
        {
            var organizationId = message.PeerSenderIdentity.Id;
            if (message.RegistryUpdateAck.IsCompleted)
            {
                _isRegistryUpdateCompleted[(Guid)organizationId] = true;
                _registryUpdatesNotCompletedCounter--;
            }

            if(_registryUpdatesNotCompletedCounter == 0)
            {
                FinishProcess();
            }
        }


        private void FinishProcess()
        {
            var updateItemProcessResultProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<UpdateItemProcessResult>>();

            var itemsIds = new ItemIds()
            {
                OrganizationId = (Guid)_updatedUserOrganizationId,
                UserId = _updatedUserId,
            };

            var updateItemProcessResultMessage = new UpdateItemProcessResult()
            {
                TicketId = _ticketId,
                TimeToLive = TimeSpan.FromMinutes(1),
                ItemIds = itemsIds,
                ItemType = "Repository",
                Message = "The item was updated successfully",
                Succeeded = true
            };

            updateItemProcessResultProducer.PublishMessage(updateItemProcessResultMessage);

            EndProcess();
        }


    }
}
