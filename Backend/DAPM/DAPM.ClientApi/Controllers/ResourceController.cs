using DAPM.ClientApi.Models;
using DAPM.ClientApi.Models.DTOs;
using DAPM.ClientApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace DAPM.ClientApi.Controllers
{
   
    [ApiController]
    [EnableCors("AllowAll")]
    [Route("organizations/")]
    
    public class ResourceController : ControllerBase
    {

        private readonly ILogger<ResourceController> _logger;
        private readonly IResourceService _resourceService;

        public ResourceController(ILogger<ResourceController> logger, IResourceService resourceService)
        {
            _logger = logger;
            _resourceService = resourceService;
        }

        [HttpGet("{organizationId}/repositories/{repositoryId}/resources/{resourceId}")]
        [Authorize]
        [SwaggerOperation(Description = "Gets a resource by id from a specific repository. The result of this endpoint does not include the resource file. There needs to be " +
            "a collaboration agreement to retrieve this information.")]
        public async Task<IActionResult> GetResourceById(Guid organizationId, Guid repositoryId, Guid resourceId)
        {
            try
            {
                // Fetch resource details
                Guid ticketId = _resourceService.GetResourceById(organizationId, repositoryId, resourceId);

                // Return success response
                return Ok(new ApiResponse
                {
                    RequestName = "GetResourceById",
                    TicketId = ticketId
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }
        }

        [HttpGet("{organizationId}/repositories/{repositoryId}/resources/{resourceId}/file")]
        [Authorize]
        [SwaggerOperation(Description = "Gets a resource file by id from a specific repository. There needs to be " +
            "a collaboration agreement to retrieve this information.")]
        public async Task<IActionResult> GetResourceFileById(Guid organizationId, Guid repositoryId, Guid resourceId)
        {
            try
            {
                // Fetch resource file
                Guid ticketId = _resourceService.GetResourceFileById(organizationId, repositoryId, resourceId);

                // Return success response
                return Ok(new ApiResponse
                {
                    RequestName = "GetResourceFileById",
                    TicketId = ticketId
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }
        }
    }    
}