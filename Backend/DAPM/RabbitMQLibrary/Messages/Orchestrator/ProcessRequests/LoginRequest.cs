using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RabbitMQLibrary.Messages.Orchestrator.ProcessRequests
{

    public class LoginRequest : IQueueMessage
    {
        public Guid TicketId { get; set; }
        public Guid OrgId {get; set;}
        public string Username { get; set; }
        public string Password { get; set; } 
        public Guid MessageId { get; set; }
        public TimeSpan TimeToLive { get; set; } = TimeSpan.FromMinutes(1);
    }
}