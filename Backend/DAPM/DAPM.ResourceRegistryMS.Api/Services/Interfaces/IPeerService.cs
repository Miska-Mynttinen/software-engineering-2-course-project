using DAPM.ResourceRegistryMS.Api.Models;
using RabbitMQLibrary.Models;

namespace DAPM.ResourceRegistryMS.Api.Services.Interfaces
{
    public interface IPeerService
    {
        Task<Peer> GetPeer(Guid id);

        Task<IEnumerable<Peer>> GetAllPeers();

        Task<Peer> PostPeer(OrganizationDTO organizationDTO);
        Task<IEnumerable<Repository>> GetRepositoriesOfOrganization(Guid organizationId);
        Task<IEnumerable<User>> GetUsersOfOrganization(Guid organizationId);
        Task<IEnumerable<UserGroup>> GetUserGroupsOfOrganization(Guid organizationId);
        Task<Repository> PostRepositoryToOrganization(Guid organizationId, RepositoryDTO repository); 
        Task<User> PostUserToOrganization(Guid organizationId, UserDTO user);
        Task<User> UpdateUserToOrganization(Guid organizationId, Guid userId, List<string> userGroups);
        Task<UserGroup> PostUserGroupToOrganization(Guid organizationId, UserGroupDTO userGroup);
    }
}
