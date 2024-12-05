using DAPM.ClientApi.Models;
using DAPM.ClientApi.Models.DTOs;
using DAPM.ClientApi.Services;
using DAPM.ClientApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RabbitMQLibrary.Models;
using Swashbuckle.AspNetCore.Annotations;

namespace DAPM.ClientApi.Controllers
{
    [ApiController]
    [EnableCors("AllowAll")]
    [Route("organizations/")]
    
    public class RepositoryController : ControllerBase
    {

        private readonly ILogger<RepositoryController> _logger;
        private readonly IRepositoryService _repositoryService;
        public RepositoryController(ILogger<RepositoryController> logger, IRepositoryService repositoryService)
        {
            _logger = logger;
            _repositoryService = repositoryService;
        }

        [HttpGet("{organizationId}/repositories/{repositoryId}")]
        [SwaggerOperation(Description = "Gets a repository by id. You need to have a collaboration agreement to retrieve this information.")]
        public async Task<ActionResult<Guid>> GetRepositoryById(Guid organizationId, Guid repositoryId)
        {
            Guid id = _repositoryService.GetRepositoryById(organizationId, repositoryId);
            return Ok(new ApiResponse { RequestName = "GetRepositoryById", TicketId = id});
        }

        [HttpGet("{organizationId}/repositories/{repositoryId}/resources")]
        [Authorize]
        [SwaggerOperation(Description = "Gets the resources in a repository by id. The result of this endpoint " +
            "does not include the resource files. You need to have a collaboration agreement to retrieve this information.")]
        public async Task<IActionResult> GetResourcesOfRepository(Guid organizationId, Guid repositoryId)
        {
            try
            {
                // Validate input
                if (organizationId == Guid.Empty || repositoryId == Guid.Empty)
                {
                    return BadRequest(new { message = "Invalid IDs provided." });
                }

                // Call service to get resources
                Guid ticketId = _repositoryService.GetResourcesOfRepository(organizationId, repositoryId);

                // Return success response
                return Ok(new ApiResponse
                {
                    RequestName = "GetResourcesOfRepository",
                    TicketId = ticketId
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
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


        [HttpGet("{organizationId}/repositories/{repositoryId}/pipelines")]
        [Authorize]
        [SwaggerOperation(Description = "Gets the pipelines of a repository by id. The result of this endpoint " +
            "does not include the JSON models of the pipelines. You need to have a collaboration agreement to retrieve this information.")]
        public async Task<IActionResult> GetPipelinesOfRepository(Guid organizationId, Guid repositoryId)
        {
            try
            {
                // Validate input
                if (organizationId == Guid.Empty || repositoryId == Guid.Empty)
                {
                    return BadRequest(new { message = "Invalid IDs provided." });
                }

                // Call service to get pipelines
                Guid ticketId = _repositoryService.GetPipelinesOfRepository(organizationId, repositoryId);

                // Return success response
                return Ok(new ApiResponse
                {
                    RequestName = "GetPipelinesOfRepository",
                    TicketId = ticketId
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
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

        [HttpPost("{organizationId}/repositories/{repositoryId}/resources")]
        [Authorize]
        [SwaggerOperation(Description = "Posts a new resource into a repository by id.")]
        public async Task<IActionResult> PostResourceToRepository(Guid organizationId, Guid repositoryId, [FromForm] ResourceForm resourceForm)
        {
            try
            {
                if (resourceForm.Name == null || resourceForm.ResourceFile == null)
                {
                    return BadRequest(new { message = "Resource name and file are required." });
                }

                // Call service to post resource to repository
                Guid ticketId = _repositoryService.PostResourceToRepository(organizationId, repositoryId, resourceForm.Name, resourceForm.ResourceFile, resourceForm.ResourceType);

                // Return success response
                return Ok(new ApiResponse
                {
                    RequestName = "PostResourceToRepository",
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


        [HttpPost("{organizationId}/repositories/{repositoryId}/resources/operators")]
        [Authorize]
        [SwaggerOperation(Description = "Posts a new operator resource into a repository by id. In this endpoint you have to provide the source code for the operator and a " +
            "Dockerfile to build it and execute it.")]
        public async Task<IActionResult> PostOperatorToRepository(Guid organizationId, Guid repositoryId, [FromForm] OperatorForm resourceForm)
        {
            try
            {
                if (resourceForm.Name == null || resourceForm.SourceCodeFile == null)
                {
                    return BadRequest(new { message = "Operator name and source code file are required." });
                }

                // Call service to post operator to repository
                Guid ticketId = _repositoryService.PostOperatorToRepository(organizationId, repositoryId, resourceForm.Name, 
                    resourceForm.SourceCodeFile, resourceForm.DockerfileFile, resourceForm.ResourceType);

                // Return success response
                return Ok(new ApiResponse
                {
                    RequestName = "PostOperatorToRepository",
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
        [HttpPost("{organizationId}/repositories/{repositoryId}/pipelines")]
        [Authorize]
        [SwaggerOperation(Description = "Posts a new pipeline into a repository by id. In this endpoint you have to provide the JSON model of the pipeline based on the model" +
            " we agreed on.")]
        public async Task<IActionResult> PostPipelineToRepository(Guid organizationId, Guid repositoryId, [FromBody] PipelineApiDto pipelineApiDto)
        {
            try
            {
                if (pipelineApiDto == null)
                {
                    return BadRequest(new { message = "Pipeline data is required." });
                }

                // Call service to post pipeline to repository
                Guid ticketId = _repositoryService.PostPipelineToRepository(organizationId, repositoryId, pipelineApiDto);

                // Return success response
                return Ok(new ApiResponse
                {
                    RequestName = "PostPipelineToRepository",
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
