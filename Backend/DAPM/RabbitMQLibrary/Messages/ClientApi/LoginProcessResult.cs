using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RabbitMQLibrary.Messages.ClientApi
{
    public class LoginProcessResult : IQueueMessage
    {
        public string Username { get; set; }
        public string UserType { get; set; }
        public string Password { get; set; }
        public Guid OrgId {get; set;}
        public Guid TicketId { get; set; } // Required by IQueueMessage
        public Guid MessageId { get; set; }
        public TimeSpan TimeToLive { get; set; } = TimeSpan.FromMinutes(1);
    }
}
