
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAPM.ResourceRegistryMS.Api.Models
{
    public class User
    {
        [Key]
        [Required]
        public Guid UserId { get; set; }

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

        public Guid PeerId { get; set; }

        // Navigation Attributes (Foreign Keys)
        [ForeignKey("PeerId")]
        public virtual Peer Peer { get; set; }
    }
}
