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
            InitializeDatabase();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }

        public void InitializeDatabase()
        {
            if (Database.GetPendingMigrations().Any())
            {
                Database.EnsureDeleted();
                Database.Migrate();

                SaveChanges();
            }

            Database.EnsureCreated();
            SaveChanges();

            // SeedAdmin();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true // Optional: for formatted JSON
            };

            modelBuilder.Entity<User>(entity =>
                {
                    entity.HasIndex(u => u.Username).IsUnique(); // Ensure uniqueness of Username
                    entity.Property(u => u.UserGroups)
                        .HasConversion(
                            v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null), // Convert List<string> to JSON
                            v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)) // Convert JSON to List<string>
                        .HasColumnType("jsonb");
                });
        }

        /* public async void SeedAdmin()
        {
            var adminUser = new User
            {
                OrganizationId = null,
                UserId = new Guid("00000000-0000-0000-0000-000000000001"),
                Username = "admin",
                Password = "admin1!", // Use a hashed password instead
                Email = "default@example.com",
                UserType = "admin",
                UserStatus = "active",
                UserGroups = new List<string> {}
            };

            await Users.AddAsync(adminUser);
            SaveChanges();
        }*/
    }
}
