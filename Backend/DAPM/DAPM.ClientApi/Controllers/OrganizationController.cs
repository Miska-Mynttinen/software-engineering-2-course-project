using DAPM.ClientApi.Models;
using DAPM.ClientApi.Models.DTOs;
using DAPM.ClientApi.Services.Interfaces;
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

        public OrganizationController(ILogger<OrganizationController> logger, IOrganizationService organizationService)
        {
            _logger = logger;
            _organizationService = organizationService;
        }

        [HttpPost("{organizationId}/repositories")]
        [SwaggerOperation(Description = "Creates a new repository for an organization by id. Right now you can create repositories for any organizations, but ideally you would " +
                                         "only be able to create repositories for your own organization.")]
        public async Task<ActionResult<ApiResponse>> PostRepositoryToOrganization(Guid organizationId, [FromBody] RepositoryApiDto repositoryDto)
        {
            // Validate inputs to ensure proper data
            if (repositoryDto == null || string.IsNullOrWhiteSpace(repositoryDto.Name) || 
                repositoryDto.Owner == Guid.Empty || string.IsNullOrWhiteSpace(repositoryDto.OwnerType))
            {
                return BadRequest(new ApiResponse
                {
                    RequestName = "PostRepositoryToOrganization",
                });
            }

            try
            {
                // Pass required parameters to the service layer and receive the repository ID
                Guid repositoryId = _organizationService.PostRepositoryToOrganization(
                    organizationId,
                    repositoryDto.Name,
                    repositoryDto.Owner,
                    repositoryDto.OwnerType,
                    repositoryDto.UserGroup);

                // Return a response containing only the repository ID
                return Ok(new ApiResponse
                {
                    RequestName = "PostRepositoryToOrganization",
                    TicketId = repositoryId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating repository for organization {organizationId}", organizationId);
                return StatusCode(500, new ApiResponse
                {
                    RequestName = "PostRepositoryToOrganization",
                });
            }
        }

        [HttpGet]
        [SwaggerOperation(Description = "Gets all peers (organizations) you are connected to. There has to be a collaboration agreement " +
                                         "and a handshake before you can see other organizations using this endpoint.")]
        public async Task<ActionResult<Guid>> Get()
        {
            Guid id = _organizationService.GetOrganizations();
            return Ok(new ApiResponse { RequestName = "GetAllOrganizations", TicketId = id });
        }

        [HttpGet("{organizationId}")]
        [SwaggerOperation(Description = "Gets an organization by id. You need to have a collaboration agreement to retrieve this information.")]
        public async Task<ActionResult<Guid>> GetById(Guid organizationId)
        {
            Guid id = _organizationService.GetOrganizationById(organizationId);
            return Ok(new ApiResponse { RequestName = "GetOrganizationById", TicketId = id });
        }

        [HttpGet("{organizationId}/repositories")]
        [SwaggerOperation(Description = "Gets all the repositories of an organization by id. You need to have a collaboration agreement to retrieve this information.")]
        public async Task<ActionResult<Guid>> GetRepositoriesOfOrganization(Guid organizationId)
        {
            Guid id = _organizationService.GetRepositoriesOfOrganization(organizationId);
            return Ok(new ApiResponse { RequestName = "GetRepositoriesOfOrganization", TicketId = id });
        }
    }
}
