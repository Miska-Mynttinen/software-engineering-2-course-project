using DAPM.ResourceRegistryMS.Api.Models;
using DAPM.ResourceRegistryMS.Api.Repositories.Interfaces;
using DAPM.ResourceRegistryMS.Api.Services.Interfaces;

namespace DAPM.ResourceRegistryMS.Api.Services
{
    public class UserService : IUserService
    {
        private readonly ILogger<IUserService> _logger;
        private IUserRepository _userRepository;

        public UserService(ILogger<IUserService> logger, 
            IUserRepository UserRepository)
        {
            _userRepository = UserRepository;
            _logger = logger;
        }

        public Task<bool> DisableUser(Guid organizationId, Guid UserId)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _userRepository.GetAllUsers();
        }

        public async Task<User> GetUserById(Guid organizationId, Guid userId)
        {
            return await _userRepository.GetUserById(organizationId, userId);
        }
        public async Task<User> UserLogin(Guid orgId, string userName, string password)
        {
            _logger.LogWarning($"Username: {userName} Password: {password} OrgId: {orgId}");
            var user = await  _userRepository.UserLogin(orgId, userName, password);
            _logger.LogWarning($"Username: {user}");
            return user;
        }


        public async Task<IEnumerable<UserGroup>> GetAllUserGroups()
        {
            return await _userRepository.GetAllUserGroups();
        }

        public async Task<UserGroup> GetUserGroupById(Guid organizationId, Guid id)
        {
            return await _userRepository.GetUserGroupById(organizationId, id);
        }
    }
}
