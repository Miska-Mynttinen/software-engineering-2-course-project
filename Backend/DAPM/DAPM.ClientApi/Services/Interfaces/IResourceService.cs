using Microsoft.AspNetCore.Mvc;

namespace DAPM.ClientApi.Services.Interfaces

{
    public interface IResourceService
    {
        public Guid GetResourceById(Guid organizationId, Guid repositoryId, Guid resourceId, Guid owner, string ownerType, Guid? userGroup);
        public Guid GetResourceFileById(Guid organizationId, Guid repositoryId, Guid resourceId, Guid owner, string ownerType, Guid? userGroup);
    }
}
