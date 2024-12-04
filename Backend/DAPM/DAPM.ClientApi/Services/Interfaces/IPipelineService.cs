namespace DAPM.ClientApi.Services.Interfaces
{
    public interface IPipelineService
    {
        public Guid GetPipelineById(Guid organizationId, Guid repositoryId, Guid pipelineI);
        public Guid CreatePipelineExecution(Guid organizationId, Guid repositoryId, Guid pipelineId, Guid owner, string ownerType, Guid? userGroup);
        public Guid PostStartCommand(Guid organizationId, Guid repositoryId, Guid pipelineId, Guid executionId, Guid owner, string ownerType, Guid? userGroup);
        public Guid GetExecutionStatus(Guid organizationId, Guid repositoryId, Guid pipelineId, Guid executionId);
    }
}
