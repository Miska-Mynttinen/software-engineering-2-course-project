using DAPM.ClientApi.Models.DTOs;
using DAPM.ClientApi.Services.Interfaces;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;
using RabbitMQLibrary.Messages.Repository;
using RabbitMQLibrary.Messages.ResourceRegistry;
using RabbitMQLibrary.Models;
using System.IO;
using System.Xml.Linq;
using BCrypt.Net;

namespace DAPM.ClientApi.Services
{
    public class UserService : IUserService
    {
        private readonly ILogger<UserService> _logger;
        private readonly ITicketService _ticketService;
        IQueueProducer<GetUsersRequest> _getUsersRequestProducer;
        IQueueProducer<GetUserRequest> _getUserRequestProducer;
        IQueueProducer<GetUserGroupsRequest> _getUserGroupsRequestProducer;
        IQueueProducer<UpdateUserRequest> _updateUserRequestProducer;
        IQueueProducer<PostUserRequest> _postUserRequestProducer;
        IQueueProducer<PostUserGroupRequest> _postUserGroupRequestProducer;

        public UserService(
            ILogger<UserService> logger,
            ITicketService ticketService,
            IQueueProducer<GetUsersRequest> getUsersRequestProducer,
            IQueueProducer<GetUserRequest> getUserRequestProducer,
            IQueueProducer<GetUserGroupsRequest> getUserGroupsRequestProducer,
            IQueueProducer<UpdateUserRequest> updateUserRequestProducer,
            IQueueProducer<PostUserRequest> postUserRequestProducer,
            IQueueProducer<PostUserGroupRequest> postUserGroupRequestProducer
        )
        {
            _ticketService = ticketService;
            _logger = logger;
            _getUsersRequestProducer = getUsersRequestProducer;
            _getUserRequestProducer = getUserRequestProducer;
            _getUserGroupsRequestProducer = getUserGroupsRequestProducer;
            _updateUserRequestProducer = updateUserRequestProducer;
            _postUserRequestProducer = postUserRequestProducer;
            _postUserGroupRequestProducer = postUserGroupRequestProducer;
        }

        public Guid GetUsersOfOrganization(Guid organizationId)
        {
            Guid ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            var message = new GetUsersRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
            };

            _getUsersRequestProducer.PublishMessage(message);

            _logger.LogDebug("GetUsersRequest Enqueued");

            return ticketId;
        }

        public Guid GetUserById(Guid organizationId, Guid UserId)
        {
            Guid ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            var message = new GetUserRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                UserId = UserId
            };

            _getUserRequestProducer.PublishMessage(message);

            _logger.LogDebug("GetUserRequest Enqueued");

            return ticketId;
        }

        public Guid UpdateUser(Guid organizationId, Guid userId, List<string> userGroups)
        {
            Guid ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            var message = new UpdateUserRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                UserId = userId,
                UserGroups = userGroups
            };

            _updateUserRequestProducer.PublishMessage(message);

            _logger.LogDebug("UpdateUserRequest Enqueued");

            return ticketId;
        }

        public Guid GetUserGroupsOfOrganization(Guid organizationId)
        {
            Guid ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            var message = new GetUserGroupsRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
            };

            _getUserGroupsRequestProducer.PublishMessage(message);

            _logger.LogDebug("GetUserGroupsRequest Enqueued");

            return ticketId;
        }

        public Guid PostUser(Guid organizationId, User user)
        {
            Guid ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);
            // Hash the user's password
            //string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

            var newUser = new UserDTO()
            {
                UserId = user.UserId,
                Username = user.Username,
                Password = user.Password,//hashedPassword,
                Email = user.Email,
                UserType = user.UserType,
                UserStatus = user.UserStatus,
                UserGroups = user.UserGroups,
                OrganizationId = organizationId
            };

            var message = new PostUserRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                User = newUser
            };

            _postUserRequestProducer.PublishMessage(message);

            _logger.LogDebug("PostUsersRequest Enqueued");

            return ticketId;
        }

        public Guid PostUserGroup(Guid organizationId, string usergroup)
        {
            Guid ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            var message = new PostUserGroupRequest
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                TicketId = ticketId,
                OrganizationId = organizationId,
                Name = usergroup
            };

            _postUserGroupRequestProducer.PublishMessage(message);

            _logger.LogDebug("PostUserGroupRequest Enqueued");

            return ticketId;
        }
    }
}
