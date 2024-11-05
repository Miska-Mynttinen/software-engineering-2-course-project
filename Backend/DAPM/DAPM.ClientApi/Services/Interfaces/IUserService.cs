using DAPM.ClientApi.Models.DTOs;
using RabbitMQLibrary.Models;

namespace DAPM.ClientApi.Services.Interfaces
{
    public interface IUserService
    {
        public Guid GetUsersOfOrganization(Guid organizationId);
        public Guid GetUserById(Guid organizationId, Guid userId);
        public Guid UpdateUser(Guid organizationId, Guid userId, List<string> userGroups);
        public Guid GetUserGroupsOfOrganization(Guid organizationId);
        public Guid PostUser(Guid organizationId, User user);
        public Guid PostUserGroup(Guid organizationId, string userGroup);
    }
}
