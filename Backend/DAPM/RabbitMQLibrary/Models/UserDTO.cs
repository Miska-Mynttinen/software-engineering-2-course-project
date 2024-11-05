using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RabbitMQLibrary.Models
{
    public class UserDTO
    {
        public Guid OrganizationId { get; set; }
        public Guid UserId { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public string UserType { get; set; }

        public string UserStatus { get; set; }

        public List<string> UserGroups { get; set; }
    }
}
