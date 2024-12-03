using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RabbitMQLibrary.Messages.Orchestrator.ServiceResults.FromRegistry
{
    public class LoginProcessResultMessage : IQueueMessage
    {
        public Guid MessageId { get; set; }
        public Guid OrgId { get; set; }
        public Guid ProcessId { get; set; }
        public TimeSpan TimeToLive { get; set; } = TimeSpan.FromMinutes(1);
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public string Username { get; set; }
        public string UserType { get; set; }
    }

}