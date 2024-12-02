namespace DAPM.ClientApi.Models.DTOs
{
    public class RepositoryApiDto
    {
        public string? Name { get; set; }
        public Guid Owner { get; set; }       
        public string? OwnerType { get; set; } 
        public Guid? UserGroup { get; set; }  
    }
}
