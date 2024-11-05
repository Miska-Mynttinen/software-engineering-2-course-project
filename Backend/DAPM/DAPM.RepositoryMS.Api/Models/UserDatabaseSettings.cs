namespace DAPM.RepositoryMS.Api.Models
{
    public class UserDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string FileCollectionName { get; set; } = null!;
    }
}
