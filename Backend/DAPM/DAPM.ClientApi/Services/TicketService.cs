﻿using DAPM.ClientApi.Services.Interfaces;
using Newtonsoft.Json.Linq;

namespace DAPM.ClientApi.Services
{
    public enum TicketStatus
    {
        NotCompleted = 0,
        Completed = 1,
        Failed = 2,
        NotFound = 3,
    }

    public enum TicketResolutionType
    {
        Json = 0,
        File = 1,
    }

    public class TicketService : ITicketService
    {
        private readonly ILogger<ITicketService> _logger;
        private Dictionary<Guid, JToken> _ticketResolutions;
        private Dictionary<Guid, TicketStatus> _ticketStatus;
        private Dictionary<Guid, TicketResolutionType> _ticketResolutionType;

        private Dictionary<Guid, Guid> _ticketOwners;
        private Dictionary<Guid, string> _ticketOwnerTypes;
        private Dictionary<Guid, Guid?> _ticketUserGroups;

        public TicketService(ILogger<ITicketService> logger)
        {
            _logger = logger;
            _ticketStatus = new Dictionary<Guid, TicketStatus>();
            _ticketResolutions = new Dictionary<Guid, JToken>();
            _ticketResolutionType = new Dictionary<Guid, TicketResolutionType>();
            _ticketOwners = new Dictionary<Guid, Guid>();
            _ticketOwnerTypes = new Dictionary<Guid, string>();
            _ticketUserGroups = new Dictionary<Guid, Guid?>();
        }

        public JToken GetTicketResolution(Guid ticketId)
        {
            JToken resolution = new JObject();
            resolution["ticketId"] = ticketId;

            if (_ticketStatus.ContainsKey(ticketId))
            {
                resolution["status"] = (int)_ticketStatus[ticketId];

                switch (_ticketStatus[ticketId])
                {
                    case TicketStatus.NotCompleted:
                        resolution["message"] = "The ticket hasn't been completed";
                        resolution["result"] = null;
                        break;

                    case TicketStatus.Completed:
                        resolution["message"] = "The ticket has been completed";
                        resolution["result"] = _ticketResolutions[ticketId];
                        break;

                    case TicketStatus.Failed:
                        resolution["message"] = "The ticket resolution failed";
                        resolution["result"] = null;
                        break;
                }

                resolution["owner"] = _ticketOwners[ticketId];
                resolution["ownerType"] = _ticketOwnerTypes[ticketId];
                resolution["userGroup"] = _ticketUserGroups[ticketId];
            }
            else
            {
                resolution["status"] = (int)TicketStatus.NotFound;
                resolution["message"] = "The ticket does not exist";
                resolution["result"] = null;
            }

            return resolution;
        }

        public void UpdateTicketStatus(Guid ticketId, TicketStatus ticketStatus)
        {
            if (_ticketStatus.ContainsKey(ticketId))
            {
                _ticketStatus[ticketId] = ticketStatus;
                _logger.LogInformation($"Ticket {ticketId} status updated to {ticketStatus}");
            }
            else
            {
                _logger.LogInformation($"A ticket status update was attempted for ticket {ticketId} but it didn't exist");
                return;
            }
        }

        public TicketStatus GetTicketStatus(Guid ticketId)
        {
            if (_ticketResolutions.ContainsKey(ticketId))
            {
                return _ticketStatus[ticketId];
            }
            else
                return TicketStatus.NotFound;
        }

        public TicketResolutionType GetTicketResolutionType(Guid ticketId)
        {
            return _ticketResolutionType[ticketId];
        }

        public Guid CreateNewTicket(TicketResolutionType resolutionType)
        {
            Guid guid = Guid.NewGuid();
            _ticketStatus[guid] = TicketStatus.NotCompleted;
            _ticketResolutionType[guid] = resolutionType;

            _logger.LogInformation($"A new ticket has been created with ID {guid}.");
            return guid;
        }

        public void UpdateTicketResolution(Guid ticketId, JToken requestResult)
        {
            if (_ticketStatus.ContainsKey(ticketId))
            {
                UpdateTicketStatus(ticketId, TicketStatus.Completed);
                _ticketResolutions[ticketId] = requestResult;
            }
            else
            {
                _logger.LogInformation($"A ticket resolution update was attempted for ticket {ticketId} but it didn't exist");
                return;
            }
            _logger.LogInformation($"Ticket resolution for ticket {ticketId} has been updated");
        }
    }
}
