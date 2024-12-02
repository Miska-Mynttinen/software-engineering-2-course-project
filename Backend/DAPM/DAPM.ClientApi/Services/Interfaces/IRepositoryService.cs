using DAPM.ClientApi.Models.DTOs;

namespace DAPM.ClientApi.Services.Interfaces
{
    public interface IRepositoryService
    {
        public Guid GetRepositoryById(Guid organizationId, Guid repositoryId, Guid owner, string ownerType, Guid? userGroup);
        public Guid GetResourcesOfRepository(Guid organizationId, Guid repositoryId, Guid owner, string ownerType, Guid? userGroup);
        public Guid GetPipelinesOfRepository(Guid organizationId, Guid repositoryId, Guid owner, string ownerType, Guid? userGroup);
        public Guid PostResourceToRepository(Guid organizationId, Guid repositoryId, string name, IFormFile resourceFile, string resourceType, Guid owner, string ownerType, Guid? userGroup);
        public Guid PostOperatorToRepository(Guid organizationId, Guid repositoryId, string name, IFormFile sourceCodeFile, IFormFile dockerfileFile, string resourceType, Guid owner, string ownerType, Guid? userGroup);
        public Guid PostPipelineToRepository(Guid organizationId, Guid repositoryId, PipelineApiDto pipeline, Guid owner, string ownerType, Guid? userGroup);
    }
}
