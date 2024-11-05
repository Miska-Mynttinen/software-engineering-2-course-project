using DAPM.RepositoryMS.Api.Models.PostgreSQL;

namespace DAPM.RepositoryMS.Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> CreateNewUser(User userObject);
        Task<User> UpdateUser(Guid userId, List<string> userGroups);
        Task<UserGroup> CreateNewUserGroup(string name);
    }
}
