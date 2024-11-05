using DAPM.RepositoryMS.Api.Models.PostgreSQL;

namespace DAPM.RepositoryMS.Api.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetUserById(Guid userId);
        Task<User> CreateUser(User userObject);
        Task<User> UpdateUser(Guid userId, List<string> userGroups);
        Task<UserGroup> GetUserGroupById(Guid userGroupId);
        Task<UserGroup> CreateUserGroup(string name);
    }
}
