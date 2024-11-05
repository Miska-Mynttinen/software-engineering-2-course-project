using Microsoft.EntityFrameworkCore;
using DAPM.ResourceRegistryMS.Api.Models;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;


public class ResourceRegistryDbContext : DbContext
{
    ILogger<ResourceRegistryDbContext> _logger;
    public ResourceRegistryDbContext(DbContextOptions<ResourceRegistryDbContext> options, ILogger<ResourceRegistryDbContext> logger) 
        : base(options)
    {
        _logger = logger;
        InitializeDatabase();
    }

    public DbSet<Resource> Resources { get; set; }
    public DbSet<Pipeline> Pipelines { get; set; }
    public DbSet<Repository> Repositories { get; set; }
    public DbSet<Peer> Peers { get; set; }
    public DbSet<ResourceType> ResourceTypes { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserGroup> UserGroups { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Repository>().HasKey(r => new { r.PeerId, r.Id });
        builder.Entity<Resource>().HasKey(r => new { r.PeerId, r.RepositoryId, r.Id });
        builder.Entity<Pipeline>().HasKey(r => new { r.PeerId, r.RepositoryId, r.Id });
        builder.Entity<User>()
            .Property(u => u.UserGroups)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null), // Convert List<string> to JSON
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)) // Convert JSON to List<string>
            .HasColumnType("jsonb"); // Specify the column type as JSONB
        builder.Entity<UserGroup>().HasKey(r => new { r.PeerId, r.Id });
    }

    public void InitializeDatabase()
    {
        if (Database.GetPendingMigrations().Any())
        {
            Database.EnsureDeleted();
            Database.Migrate();

     
            SaveChanges();
        }
    }
}
