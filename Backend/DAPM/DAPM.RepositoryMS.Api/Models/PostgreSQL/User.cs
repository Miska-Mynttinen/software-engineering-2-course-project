using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DAPM.RepositoryMS.Api.Models.PostgreSQL
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid UserId { get; set; }
        public Guid OrganizationId { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public string Email { get; set; }

        [Required]
        public string UserType { get; set; }

        [Required]
        public string UserStatus { get; set; }

        [Required]
        public List<string> UserGroups { get; set; }
    }
}
