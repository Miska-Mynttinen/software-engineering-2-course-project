using DAPM.RepositoryMS.Api.Repositories.Interfaces;
using DAPM.RepositoryMS.Api.Models.PostgreSQL;
using DAPM.RepositoryMS.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace DAPM.RepositoryMS.Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly UserDbContext _context;

        public UserRepository(UserDbContext context)
        {
            _context = context;
        }

        public async Task<User> CreateUser(User userObject)
        {
            User user = new User
            {
                UserId = userObject.UserId,
                Username = userObject.Username,
                Password = userObject.Password,
                Email = userObject.Email,
                UserType = userObject.UserType,
                UserStatus = userObject.UserStatus,
                UserGroups = userObject.UserGroups,
                OrganizationId = userObject.OrganizationId
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> GetUserById(Guid userId)
        {
            return await _context.Users.FirstOrDefaultAsync(r => r.UserId == userId);
        }
        public async Task<User> GetUserByName(string userName)
        {
            return await _context.Users.FirstOrDefaultAsync(r => r.Username == userName);
        }
        public async Task<UserGroup> CreateUserGroup(string name)
        {
            UserGroup userGroup = new UserGroup() { Name = name };
            await _context.UserGroups.AddAsync(userGroup);
            _context.SaveChanges();
            return userGroup;
        }

        public async Task<UserGroup> GetUserGroupById(Guid userGroupId)
        {
            return await _context.UserGroups.FirstOrDefaultAsync(r => r.Id == userGroupId);
        }
    
        public async Task<User> UpdateUser(Guid userId, List<string> userGroups)
        {
            // Find the existing user
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return null; // or throw an exception if you prefer
            }

            // Update properties
            user.Username = user.Username;
            user.Password = user.Password;
            user.Email = user.Email;
            user.UserType = user.UserType;
            user.UserStatus = user.UserStatus;
            user.UserGroups = userGroups;
            user.OrganizationId = user.OrganizationId;

            // Save changes to the database
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return user;
        }
    }
}
