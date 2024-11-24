using DAPM.ResourceRegistryMS.Api.Models;
using DAPM.ResourceRegistryMS.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAPM.ResourceRegistryMS.Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ResourceRegistryDbContext _context;

        public UserRepository(ResourceRegistryDbContext context)
        {
            _context = context;
        }

        public async Task<User> PostUser(User user)
        {
            await _context.Users.AddAsync(user);
            _context.SaveChanges();
            return user;
        }

        public async Task<User> UpdateUser(User user)
        {
            _context.Users.Update(user);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<IEnumerable<User>> GetUsersOfOrganization(Guid organizationId)
        {
            return _context.Users.Where(r => r.PeerId == organizationId);
        }

        public async Task<User> GetUserById(Guid organizationId, Guid UserId)
        {
            var user = _context.Users.Include(r => r.Peer).Single(r => r.UserId == UserId && r.PeerId == organizationId);

            if (user == null)
            {
                return null;
            }

            return user;
        }
        public async Task<User> UserLogin(Guid orgId, string userName, string password)
        {
            var user = _context.Users.Include(r => r.Peer).Single(r => r.Username == userName && r.Password == password && r.PeerId == orgId);
            return user;
        }

        public async Task<UserGroup> PostUserGroup(UserGroup userGroup)
        {
            await _context.UserGroups.AddAsync(userGroup);
            _context.SaveChanges();
            return userGroup;
        }

        public async Task<IEnumerable<UserGroup>> GetAllUserGroups()
        {
            return await _context.UserGroups.ToListAsync();
        }

        public async Task<IEnumerable<UserGroup>> GetUserGroupsOfOrganization(Guid organizationId)
        {
            return _context.UserGroups.Where(r => r.PeerId == organizationId);
        }

        public async Task<UserGroup> GetUserGroupById(Guid organizationId, Guid id)
        {
            var userGroup = _context.UserGroups.Include(r => r.Peer).Single(r => r.Id == id && r.PeerId == organizationId);

            if (userGroup == null)
            {
                return null;
            }

            return userGroup;
        }
    }
}
