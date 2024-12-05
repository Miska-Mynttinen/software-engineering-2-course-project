using DAPM.ResourceRegistryMS.Api.Models;

namespace DAPM.ResourceRegistryMS.Api.Repositories.Interfaces
{
    public interface IUserRepository
    {
        public Task<IEnumerable<User>> GetAllUsers();
        public Task<User> GetUserById(Guid organizationId, Guid userId);
        public Task<User> UserLogin(Guid orgId, string userName, string password);
        public Task<User> PostUser(User repository);
        public Task<User> UpdateUser(User repository);
        public Task<IEnumerable<User>> GetUsersOfOrganization(Guid organizationId);
        public Task<IEnumerable<UserGroup>> GetAllUserGroups();
        public Task<UserGroup> GetUserGroupById(Guid organizationId, Guid id);
        public Task<UserGroup> PostUserGroup(UserGroup repository);
        public Task<IEnumerable<UserGroup>> GetUserGroupsOfOrganization(Guid organizationId);
    }
}
