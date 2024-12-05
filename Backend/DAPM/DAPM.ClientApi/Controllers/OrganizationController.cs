using DAPM.ClientApi.Models;
using DAPM.ClientApi.Models.DTOs;
using DAPM.ClientApi.Services;
using DAPM.ClientApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace DAPM.ClientApi.Controllers
{
    [ApiController]
    [EnableCors("AllowAll")]
    [Route("organizations")]
    
    public class OrganizationController : ControllerBase
    {

        private readonly ILogger<OrganizationController> _logger;
        private readonly IOrganizationService _organizationService;
        private readonly IAuthenticationService _authenticationService;

        public OrganizationController(ILogger<OrganizationController> logger, IOrganizationService organizationService, IAuthenticationService authenticationService)
        {
            _logger = logger;
            _organizationService = organizationService;
            _authenticationService = authenticationService;
        }

        [HttpGet]
        [SwaggerOperation(Description = "Gets all peers (organizations) you are connected to. There has to be a collaboration agreement " +
            "and a handshake before you can see other organizations using this endpoint.")]
        public async Task<ActionResult<Guid>> Get()
        {
            Guid id = _organizationService.GetOrganizations();
            return Ok(new ApiResponse { RequestName = "GetAllOrganizations", TicketId = id});
        }

        
        [HttpGet("{organizationId}")]
        [SwaggerOperation(Description = "Gets an organization by id. You need to have a collaboration agreement to retrieve this information.")]
        public async Task<ActionResult<Guid>> GetById(Guid organizationId)
        {
            Guid id = _organizationService.GetOrganizationById(organizationId);
            return Ok(new ApiResponse { RequestName = "GetOrganizationById", TicketId = id });
        }

        [HttpGet("{organizationId}/repositories")]
        [Authorize]
        [SwaggerOperation(Description = "Gets all the repositories of an organization by id. You need to have a collaboration agreement to retrieve this information.")]
        public async Task<ActionResult<Guid>> GetRepositoriesOfOrganization(Guid organizationId)
        {
            try
            {
                if (organizationId == Guid.Empty)
                {
                    return BadRequest(new { message = "Invalid organization ID." });
                }

                // Call the service to get the repositories
                Guid ticketId = _organizationService.GetRepositoriesOfOrganization(organizationId);

                return Ok(new ApiResponse
                {
                    RequestName = "GetRepositoriesOfOrganization",
                    TicketId = ticketId
                });
            }
            catch (KeyNotFoundException ex)
            {
                // Handle specific cases like organization not found
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                // Handle unauthorized access
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                // Handle all other exceptions
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }
        }

        [HttpPost("{organizationId}/repositories")]
        [Authorize]
        [SwaggerOperation(Description = "Creates a new repository for an organization by id. Right now you can create repositories for any organizations, but ideally you would " +
            "only be able to create repositories for your own organization.")]
        public async Task<ActionResult<Guid>> PostRepositoryToOrganization(Guid organizationId, [FromBody] RepositoryApiDto repositoryDto)
        {
            try
            {
                if (organizationId == Guid.Empty)
                {
                    return BadRequest(new { message = "Invalid organization ID." });
                }

                // Call the service to get the repositories
                Guid id = _organizationService.PostRepositoryToOrganization(organizationId, repositoryDto.Name);

                return Ok(new ApiResponse
                {
                    RequestName = "PostRepositoryToOrganization",
                    TicketId = id
                });
            }
            catch (KeyNotFoundException ex)
            {
                // Handle specific cases like organization not found
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                // Handle unauthorized access
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                // Handle all other exceptions
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }
        }

    }
}
