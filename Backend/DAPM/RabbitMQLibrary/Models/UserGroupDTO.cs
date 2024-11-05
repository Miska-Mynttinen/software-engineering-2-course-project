using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RabbitMQLibrary.Models
{
    public class UserGroupDTO
    {
        public Guid OrganizationId { get; set; }
        public Guid Id { get; set; }

        public string Name { get; set; }
    }
}
