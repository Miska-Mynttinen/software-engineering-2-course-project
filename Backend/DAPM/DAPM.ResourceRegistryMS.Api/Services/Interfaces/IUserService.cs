using DAPM.ResourceRegistryMS.Api.Models;
using RabbitMQLibrary.Models;

namespace DAPM.ResourceRegistryMS.Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> GetUserById(Guid organizationId, Guid userId);
        Task<IEnumerable<User>> GetAllUsers();
        Task<bool> DisableUser(Guid organizationId, Guid userId);
        Task<UserGroup> GetUserGroupById(Guid organizationId, Guid id);
        Task<IEnumerable<UserGroup>> GetAllUserGroups();
    }
}
