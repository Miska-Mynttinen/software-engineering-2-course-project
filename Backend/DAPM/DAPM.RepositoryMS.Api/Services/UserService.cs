using DAPM.RepositoryMS.Api.Repositories.Interfaces;
using DAPM.RepositoryMS.Api.Services.Interfaces;
using DAPM.RepositoryMS.Api.Models.PostgreSQL;
using System.Threading.Tasks;

namespace DAPM.RepositoryMS.Api.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> UpdateUser(Guid userId, List<string> userGroups)
        {
            return await _userRepository.UpdateUser(userId, userGroups);
        }
        public async Task<User> CreateNewUser(User userObject)
        {
            return await _userRepository.CreateUser(userObject);
        }

        public async Task<UserGroup> CreateNewUserGroup(string name)
        {
            return await _userRepository.CreateUserGroup(name);
        }
    }
}
