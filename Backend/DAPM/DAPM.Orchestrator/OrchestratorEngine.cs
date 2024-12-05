using DAPM.Orchestrator.Processes;
using DAPM.Orchestrator.Processes.PipelineActions;
using DAPM.Orchestrator.Processes.PipelineCommands;
using DAPM.Orchestrator.Services.Models;
using RabbitMQLibrary.Messages.PipelineOrchestrator;
using RabbitMQLibrary.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DAPM.Orchestrator
{
    public class OrchestratorEngine : IOrchestratorEngine
    {
        private ILogger<OrchestratorEngine> _logger;
        private Dictionary<Guid, OrchestratorProcess> _processes;
        private IServiceProvider _serviceProvider;

        public OrchestratorEngine(IServiceProvider serviceProvider, ILogger<OrchestratorEngine> logger)
        {
            _processes = new Dictionary<Guid, OrchestratorProcess>();
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public void DeleteProcess(Guid processId)
        {
            _logger.LogInformation("ORCHESTRATOR ENGINE removing process with id " + processId.ToString());
            _processes.Remove(processId);
        }

        public OrchestratorProcess GetProcess(Guid processId)
        {
            try {
                OrchestratorProcess process1 = _processes[processId];
                return process1;
            } catch {
                throw new FileNotFoundException($"Process not found in processes {_processes} was not found.");
            }
        }

        public Dictionary<Guid, OrchestratorProcess> GetProcessesDictionary()
        {
            return _processes;
        }



        #region PROCESSES TRIGGERED FROM CLIENT API

        public void StartCollabHandshakeProcess(Guid apiTicketId, string requestedPeerDomain)
        {
            var processId = Guid.NewGuid();
            var collabHandshakeProcess = new CollabHandshakeProcess(this, _serviceProvider, apiTicketId, processId, requestedPeerDomain);
            _processes[processId] = collabHandshakeProcess;
            collabHandshakeProcess.StartProcess();
        }

        public void StartCreatePipelineExecutionProcess(Guid apiTicketId, Guid organizationId, Guid repositoryId, Guid pipelineId)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var createPipelineExecutionProcess = new CreatePipelineExecutionProcess(this, _serviceProvider, apiTicketId, processId, organizationId, repositoryId, pipelineId);
            _processes[processId] = createPipelineExecutionProcess;
            createPipelineExecutionProcess.StartProcess();
        }

        public void StartCreateRepositoryProcess(Guid apiTicketId, Guid organizationId, string name)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var createRepositoryProcess = new CreateRepositoryProcess(this, _serviceProvider, apiTicketId, processId, organizationId, name);
            _processes[processId] = createRepositoryProcess;
            createRepositoryProcess.StartProcess();
        }

        public void StartUpdateUserProcess(Guid apiTicketId, Guid organizationId, Guid userId, List<string> userGroups)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var updateUserProcess = new UpdateUserProcess(this, _serviceProvider, apiTicketId, processId, organizationId, userId, userGroups);
            _processes[processId] = updateUserProcess;
            updateUserProcess.StartProcess();
        }

        public void StartCreateUserProcess(Guid apiTicketId, Guid organizationId, UserDTO user)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var createUserProcess = new CreateUserProcess(this, _serviceProvider, apiTicketId, processId, organizationId, user);
            _processes[processId] = createUserProcess;
            createUserProcess.StartProcess();
        }

        public void StartCreateUserGroupProcess(Guid apiTicketId, Guid organizationId, string name)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var createUserGroupProcess = new CreateUserGroupProcess(this, _serviceProvider, apiTicketId, processId, organizationId, name);
            _processes[processId] = createUserGroupProcess;
            createUserGroupProcess.StartProcess();
        }

        public void StartGetOrganizationProcess(Guid apiTicketId, Guid? organizationId)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var getOrganizationProcess = new GetOrganizationsProcess(this, _serviceProvider, apiTicketId, processId, organizationId);
            _processes[processId] = getOrganizationProcess;
            getOrganizationProcess.StartProcess();
        }

        public void StartGetPipelinesProcess(Guid apiTicketId, Guid organizationId, Guid repositoryId, Guid? pipelineId)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var getPipelinesProcess = new GetPipelinesProcess(this, _serviceProvider, apiTicketId, processId, organizationId, repositoryId, pipelineId);
            _processes[processId] = getPipelinesProcess;
            getPipelinesProcess.StartProcess();
        }

        public void StartGetRepositoriesProcess(Guid apiTicketId, Guid organizationId, Guid? repositoryId)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var getRepositoriesProcess = new GetRepositoriesProcess(this, _serviceProvider, apiTicketId, processId, organizationId, repositoryId);
            _processes[processId] = getRepositoriesProcess;
            getRepositoriesProcess.StartProcess();
        }
        public void StartLoginProcess(Guid apiTicketId, string username, string password, Guid orgId)
        {
            var processId = apiTicketId; // Use apiTicketId as the processId
            var loginProcess = new LoginProcess(this, _serviceProvider, apiTicketId, orgId, processId, username, password);
            _processes[processId] = loginProcess;
            loginProcess.StartProcess();
        }

        public void StartGetUsersProcess(Guid apiTicketId, Guid organizationId, Guid? userId)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var getUsersProcess = new GetUsersProcess(this, _serviceProvider, apiTicketId, processId, organizationId, userId);
            _processes[processId] = getUsersProcess;
            getUsersProcess.StartProcess();
        }

        public void StartGetUserGroupsProcess(Guid apiTicketId, Guid organizationId, Guid? userGroupId)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var getUserGroupsProcess = new GetUserGroupsProcess(this, _serviceProvider, apiTicketId, processId, organizationId, userGroupId);
            _processes[processId] = getUserGroupsProcess;
            getUserGroupsProcess.StartProcess();
        }

        public void StartGetResourceFilesProcess(Guid apiTicketId, Guid organizationId, Guid repositoryId, Guid resourceId)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var getResourceFilesProcess = new GetResourceFilesProcess(this, _serviceProvider, apiTicketId, processId, organizationId, repositoryId, resourceId);
            _processes[processId] = getResourceFilesProcess;
            getResourceFilesProcess.StartProcess();
        }

        public void StartGetResourcesProcess(Guid apiTicketId, Guid organizationId, Guid repositoryId, Guid? resourceId)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var getResourcesProcess = new GetResourcesProcess(this, _serviceProvider, apiTicketId, processId, organizationId, repositoryId, resourceId);
            _processes[processId] = getResourcesProcess;
            getResourcesProcess.StartProcess();
        }

        public void StartPipelineStartCommandProcess(Guid apiTicketId, Guid executionId)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var pipelineStartCommandProcess = new PipelineStartCommandProcess(this, _serviceProvider, apiTicketId, processId, executionId);
            _processes[processId] = pipelineStartCommandProcess;
            pipelineStartCommandProcess.StartProcess();
        }

        public void StartPostPipelineProcess(Guid apiTicketId, Guid organizationId, Guid repositoryId, Pipeline pipeline, string name)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var postPipelineProcess = new PostPipelineProcess(this, _serviceProvider, apiTicketId, processId, organizationId, repositoryId, pipeline, name);
            _processes[processId] = postPipelineProcess;
            postPipelineProcess.StartProcess();
        }

        public void StartPostResourceProcess(Guid apiTicketId, Guid organizationId, Guid repositoryId, string name, string resourceType, FileDTO file)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var postResourceProcess = new PostResourceProcess(this, _serviceProvider, apiTicketId, processId, organizationId, repositoryId, name, resourceType, file);
            _processes[processId] = postResourceProcess;
            postResourceProcess.StartProcess();
        }

        public void StartPostOperatorProcess(Guid apiTicketId, Guid organizationId, Guid repositoryId, string name, string resourceType, FileDTO sourceCodeFile,
            FileDTO dockerfileFile)
        {
            var processId = apiTicketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var postOperatorProcess = new PostOperatorProcess(this, _serviceProvider, apiTicketId, processId, organizationId, repositoryId, name, resourceType, sourceCodeFile,
                dockerfileFile);
            _processes[processId] = postOperatorProcess;
            postOperatorProcess.StartProcess();
        }

        public void StartGetPipelineExecutionStatusProcess(Guid ticketId, Guid executionId)
        {
            var processId = ticketId; // Use apiTicketId as processId instead of Guid.NewGuid();
            var getPipelineExecutionStatusProcess = new GetPipelineExecutionStatusProcess(this, _serviceProvider, ticketId, processId, executionId);
            _processes[processId] = getPipelineExecutionStatusProcess;
            getPipelineExecutionStatusProcess.StartProcess();
        }

        #endregion

        #region PROCESSES TRIGGERED BY SYSTEM


        public void StartCollabHandshakeResponseProcess(Guid senderProcessId, Identity requesterPeerIdentity)
        {
            var registerPeerProcess = new CollabHandshakeResponseProcess(this, _serviceProvider, senderProcessId, requesterPeerIdentity);
            _processes[senderProcessId] = registerPeerProcess;
            registerPeerProcess.StartProcess();
        }

        

        public void StartExecuteOperatorActionProcess(Guid? senderProcessId, IdentityDTO orchestratorIdentity, ExecuteOperatorActionDTO data)
        {
            var processId = Guid.NewGuid();
            var executeOperatorActionProcess = new ExecuteOperatorActionProcess(this, _serviceProvider, processId, senderProcessId, data, orchestratorIdentity);
            _processes[processId] = executeOperatorActionProcess;
            executeOperatorActionProcess.StartProcess();
        }

        

        public void StartTransferDataActionProcess(Guid? senderProcessId, IdentityDTO orchestratorIdentity, TransferDataActionDTO data)
        {
            var processId = Guid.NewGuid();
            var transferDataActionProcess = new TransferDataActionProcess(this, _serviceProvider, processId, senderProcessId, data, orchestratorIdentity);
            _processes[processId] = transferDataActionProcess;
            transferDataActionProcess.StartProcess();
        }

        public void StartRegistryUpdateProcess(Guid senderProcessId, RegistryUpdateDTO registryUpdate, IdentityDTO senderIdentity)
        {
            var processId = Guid.NewGuid();
            var registryUpdateProcess = new RegistryUpdateProcess(this, _serviceProvider, processId, senderProcessId, registryUpdate, senderIdentity);
            _processes[processId] = registryUpdateProcess;
            registryUpdateProcess.StartProcess();
        }

        public void StartPostResourceFromPeerProcess(Guid senderProcessId, ResourceDTO resource, int storageMode, Guid executionId, IdentityDTO senderIdentity)
        {
            var processId = Guid.NewGuid(); 
            var postResourceProcess = new PostResourceFromPeerProcess(this, _serviceProvider, processId, senderProcessId, resource, storageMode, executionId, senderIdentity);
            _processes[processId] = postResourceProcess;
            postResourceProcess.StartProcess();
        }

        public void StartSendTransferDataActionProcess(TransferDataActionDTO data)
        {
            var processId = Guid.NewGuid();
            var sendTransferDataActionProcess = new SendTransferDataActionProcess(this, _serviceProvider, processId, data);
            _processes[processId] = sendTransferDataActionProcess;
            sendTransferDataActionProcess.StartProcess();
        }

        public void StartSendExecuteOperatorActionProcess(ExecuteOperatorActionDTO data)
        {
            var processId = Guid.NewGuid();
            var sendExecuteOperatorActionProcess = new SendExecuteOperatorActionProcess(this, _serviceProvider, processId, data);
            _processes[processId] = sendExecuteOperatorActionProcess;
            sendExecuteOperatorActionProcess.StartProcess();
        }


        #endregion
    }
}
