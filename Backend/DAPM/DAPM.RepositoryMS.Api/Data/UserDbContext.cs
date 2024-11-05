using DAPM.RepositoryMS.Api.Models.PostgreSQL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace DAPM.RepositoryMS.Api.Data
{
    public class UserDbContext : DbContext
    {
        private readonly ILogger<UserDbContext> _logger;

        public UserDbContext(DbContextOptions<UserDbContext> options, ILogger<UserDbContext> logger) 
            : base(options)
        {
            _logger = logger;
            // Optionally, you can call InitializeDatabaseAsync here if you want to ensure the database is ready
            InitializeDatabase();
            // SeedData();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }

        public void InitializeDatabase()
        {
            /* if (Database.GetPendingMigrations().Any())
            {
                Database.EnsureDeleted();
                Database.Migrate();

                SaveChanges();
            } */

            Database.EnsureCreated();
            SaveChanges();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true // Optional: for formatted JSON
            };

            modelBuilder.Entity<User>()
                .Property(u => u.UserGroups)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, options),
                    v => JsonSerializer.Deserialize<List<string>>(v, options) ?? new List<string>()); // Fallback to an empty list if null
        }

        // Optional: Seed initial data
        /* public void SeedData()
        {
            var adminUser = new User
            {
                UserId = new Guid("00000000-0000-0000-0000-000000000001"),
                Username = "admin",
                Password = "admin", // Use a hashed password instead
                Email = "default@example.com",
                UserType = "Admin",
                UserStatus = "Active",
                UserGroups = new List<string> {}
            };

            Users.Add(adminUser); // Add the user to the DbSet
            SaveChanges(); // Save changes to the database
        } */
    }
}
