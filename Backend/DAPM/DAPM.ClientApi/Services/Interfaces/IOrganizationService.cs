﻿namespace DAPM.ClientApi.Services.Interfaces
{
    public interface IOrganizationService
    {
        public Guid GetOrganizationById(Guid organizationId);
        public Guid GetRepositoriesOfOrganization(Guid organizationId); 
        public Guid PostRepositoryToOrganization(Guid organizationId, string name, Guid owner, string ownerType, Guid? userGroup);
    }
}
