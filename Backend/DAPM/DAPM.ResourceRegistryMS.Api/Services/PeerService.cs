using DAPM.ResourceRegistryMS.Api.Models;
using DAPM.ResourceRegistryMS.Api.Repositories.Interfaces;
using DAPM.ResourceRegistryMS.Api.Services.Interfaces;
using RabbitMQLibrary.Models;

namespace DAPM.ResourceRegistryMS.Api.Services
{
    public class PeerService : IPeerService
    {
        private IPeerRepository _peerRepository;
        private IRepositoryRepository _repositoryRepository;
        private IUserRepository _userRepository;
        private readonly ILogger<IPeerService> _logger;

        public PeerService(ILogger<IPeerService> logger, IPeerRepository peerRepository, IRepositoryRepository repositoryRepository, IUserRepository userRepository)
        {
            _peerRepository = peerRepository;
            _repositoryRepository = repositoryRepository;
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<Peer> GetPeer(Guid id)
        {
            return await _peerRepository.GetPeerById(id);
        }

        public async Task<Peer> PostPeer(OrganizationDTO organizationDTO)
        {
            var peer = new Peer()
            {
                Id = organizationDTO.Id,
                Name = organizationDTO.Name,
                Domain = organizationDTO.Domain,
            };

            return await _peerRepository.AddPeer(peer);
        }

        public async Task<IEnumerable<Peer>> GetAllPeers()
        {
            return await _peerRepository.GetAllPeers();
        }

        public async Task<IEnumerable<Repository>> GetRepositoriesOfOrganization(Guid organizationId)
        {
            return await _repositoryRepository.GetRepositoriesOfOrganization(organizationId); 
        }

        public async Task<IEnumerable<User>> GetUsersOfOrganization(Guid organizationId)
        {
            return await _userRepository.GetUsersOfOrganization(organizationId); 
        }

        public async Task<IEnumerable<UserGroup>> GetUserGroupsOfOrganization(Guid organizationId)
        {
            return await _userRepository.GetUserGroupsOfOrganization(organizationId); 
        }

        public async Task<Repository> PostRepositoryToOrganization(Guid organizationId, RepositoryDTO repositoryDTO)
        {
            Repository repository = new Repository()
            {
                Id = repositoryDTO.Id,
                Name = repositoryDTO.Name,
                PeerId = organizationId,
            };

            return await _repositoryRepository.PostRepository(repository);
        }

        public async Task<User> PostUserToOrganization(Guid organizationId, UserDTO userDTO)
        {
            User user = new User()
            {
                UserId = userDTO.UserId,
                Username = userDTO.Username,
                PeerId = organizationId,
                Password = userDTO.Password,
                Email = userDTO.Email,
                UserType = userDTO.UserType,
                UserStatus = userDTO.UserStatus,
                UserGroups = userDTO.UserGroups,
            };

            return await _userRepository.PostUser(user);
        }

        public async Task<User> UpdateUserToOrganization(Guid organizationId, Guid userId, List<string> userGroups)
        {
            User user = await _userRepository.GetUserById(organizationId, userId);

            _logger.LogWarning("PeerService UpdateUserToOrganization LOG: UserGroups = {UserGroups}", string.Join(", ", user.UserGroups));

            // Update user object with new UserGroups
            user.PeerId = organizationId;
            user.UserGroups = userGroups;

            return await _userRepository.UpdateUser(user);
        }

        public async Task<UserGroup> PostUserGroupToOrganization(Guid organizationId, UserGroupDTO userGroupDTO)
        {
            UserGroup userGroup = new UserGroup()
            {
                Id = userGroupDTO.Id,
                Name = userGroupDTO.Name,
                PeerId = organizationId,
            };

            return await _userRepository.PostUserGroup(userGroup);
        }
    }
}
