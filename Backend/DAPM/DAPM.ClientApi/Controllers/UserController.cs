using DAPM.ClientApi.Models;
using DAPM.ClientApi.Models.DTOs;
using DAPM.ClientApi.Services;
using DAPM.ClientApi.Services.Interfaces;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RabbitMQLibrary.Models;
using Swashbuckle.AspNetCore.Annotations;

namespace DAPM.ClientApi.Controllers
{
    [ApiController]
    [EnableCors("AllowAll")]
    [Route("organizations/")]
    public class UserController : ControllerBase
    {

        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;
        public UserController(ILogger<UserController> logger, IUserService UserService)
        {
            _logger = logger;
            _userService = UserService;
        }

        [HttpGet("{organizationId}/users")]
        [SwaggerOperation(Description = "Gets all the users of an organization by id. You need to have a collaboration agreement to retrieve this information.")]
        public async Task<ActionResult<Guid>> GetUsersOfOrganization(Guid organizationId)
        {
            Guid id = _userService.GetUsersOfOrganization(organizationId);
            return Ok(new ApiResponse {RequestName = "GetUsersOfOrganization", TicketId = id });
        }

        [HttpGet("{organizationId}/users/{UserId}")]
        [SwaggerOperation(Description = "Gets a User by id. You need to have a collaboration agreement to retrieve this information.")]
        public async Task<ActionResult<Guid>> GetUserById(Guid organizationId, Guid userId)
        {
            Guid id = _userService.GetUserById(organizationId, userId);
            return Ok(new ApiResponse { RequestName = "GetUserById", TicketId = id});
        }

        [HttpPut("{organizationId}/users/{UserId}")]
        [SwaggerOperation(Description = "Updates a specific users userGroups")]
        public async Task<ActionResult<Guid>> UpdateUser(Guid organizationId, Guid userId, [FromBody] List<string> userGroups)
        {
            Guid id = _userService.UpdateUser(organizationId, userId, userGroups);
            return Ok(new ApiResponse { RequestName = "UpdateUser", TicketId = id});
        }

        [HttpGet("{organizationId}/usergroups")]
        [SwaggerOperation(Description = "Gets all the usergroups of an organization by id. You need to have a collaboration agreement to retrieve this information.")]
        public async Task<ActionResult<Guid>> GetUserGroupsOfOrganization(Guid organizationId)
        {
            Guid id = _userService.GetUserGroupsOfOrganization(organizationId);
            return Ok(new ApiResponse {RequestName = "GetUserGroupsOfOrganization", TicketId = id });
        }

        [HttpPost("{organizationId}/users")]
        [SwaggerOperation(Description = "Creates a new user for an organization by id. Right now you can create users for any organizations, but ideally you would " +
            "only be able to create users for your own organization.")]
        public async Task<ActionResult<Guid>> PostUser(Guid organizationId, [FromBody] User user)
        {
            Guid id = _userService.PostUser(organizationId, user);
            return Ok(new ApiResponse { RequestName = "PostUser", TicketId = id });
        }

        [HttpPost("{organizationId}/usergroups")]
        [SwaggerOperation(Description = "Creates a new user for an organization by id. Right now you can create users for any organizations, but ideally you would " +
            "only be able to create users for your own organization.")]
        public async Task<ActionResult<Guid>> PostUserGroup(Guid organizationId, [FromBody] UserGroupApiDto userGroupDto)
        {
            Guid id = _userService.PostUserGroup(organizationId, userGroupDto.Name);
            return Ok(new ApiResponse { RequestName = "PostUserGroup", TicketId = id });
        }
    }
}
