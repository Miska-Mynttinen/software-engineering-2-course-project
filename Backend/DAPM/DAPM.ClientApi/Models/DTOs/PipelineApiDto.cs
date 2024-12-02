using RabbitMQLibrary.Models;

namespace DAPM.ClientApi.Models.DTOs
{
    public class PipelineApiDto
    {
        public string? Name { get; set; }
        public Pipeline? Pipeline { get; set; }
        public Guid Owner { get; set; }       
        public string? OwnerType { get; set; } 
        public Guid? UserGroup { get; set; }  
    }
}
