using DAPM.ClientApi.Models;
using DAPM.ClientApi.Models.DTOs;
using DAPM.ClientApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.PipelineOrchestrator;
using Swashbuckle.AspNetCore.Annotations;

namespace DAPM.ClientApi.Controllers
{
    [ApiController]
    [EnableCors("AllowAll")]
    [Route("organizations/")]
    
    public class PipelineController : ControllerBase
    {
        private readonly ILogger<PipelineController> _logger;
        private readonly IPipelineService _pipelineService;
        

        public PipelineController(ILogger<PipelineController> logger, IPipelineService pipelineService, IQueueProducer<CreateInstanceExecutionMessage> createInstanceProducer)
        {
            _logger = logger;
            _pipelineService = pipelineService;
        }

        [HttpGet("{organizationId}/repositories/{repositoryId}/pipelines/{pipelineId}")]
        [Authorize]
        [SwaggerOperation(Description = "Gets a pipeline by id. This endpoint includes the " +
            "pipeline model in JSON. You need to have a collaboration agreement to retrieve this information.")]
        public async Task<IActionResult> GetPipelineById(Guid organizationId, Guid repositoryId, Guid pipelineId)
        {
            try
            {
                // Validate inputs
                if (organizationId == Guid.Empty || repositoryId == Guid.Empty || pipelineId == Guid.Empty)
                {
                    return BadRequest(new { message = "Invalid IDs provided." });
                }

                // Call the service to get the pipeline
                Guid ticketId = _pipelineService.GetPipelineById(organizationId, repositoryId, pipelineId);

                // Return success response
                return Ok(new ApiResponse
                {
                    RequestName = "GetPipelineById",
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


        [HttpPost("{organizationId}/repositories/{repositoryId}/pipelines/{pipelineId}/executions")]
        [Authorize]
        [SwaggerOperation(Description = "Creates a new execution instance for a pipeline previously saved in the system. The execution is created but not started")]
        public async Task<ActionResult<Guid>> CreatePipelineExecutionInstance(Guid organizationId, Guid repositoryId, Guid pipelineId)
        {
            Guid id = _pipelineService.CreatePipelineExecution(organizationId, repositoryId, pipelineId);
            return Ok(new ApiResponse { RequestName = "CreatePipelineExecutionInstance", TicketId = id });
        }

        [HttpPost("{organizationId}/repositories/{repositoryId}/pipelines/{pipelineId}/executions/{executionId}/commands/start")]
        [Authorize]
        [SwaggerOperation(Description = "Posts a start command to the defined pipeline execution. The start command will start the pipeline execution.")]
        public async Task<ActionResult<ApiResponse>> PostStartCommand(Guid organizationId, Guid repositoryId, Guid pipelineId, Guid executionId)
        {
            try
            {
                // Make sure the service call is asynchronous
                Guid id = _pipelineService.PostStartCommand(organizationId, repositoryId, pipelineId, executionId);

                // Return a proper response object
                return Ok(new ApiResponse { RequestName = "PostStartCommand", TicketId = id });
            }
            catch (KeyNotFoundException ex)
            {
                // Handle specific exceptions (e.g., entity not found)
                return NotFound(new { Message = $"One or more provided IDs were not found. Details: {ex.Message}" });
            }
            catch (Exception ex)
            {
                // Catch-all for any other unhandled exceptions
                return StatusCode(500, new { Message = $"An error occurred while processing the request. Details: {ex.Message}" });
            }
        }


        [HttpGet("{organizationId}/repositories/{repositoryId}/pipelines/{pipelineId}/executions/{executionId}/status")]
        [Authorize]
        [SwaggerOperation(Description = "Gets the status of a running execution")]
        public async Task<IActionResult> GetPipelineExecutionStatus(Guid organizationId, Guid repositoryId, Guid pipelineId, Guid executionId)
        {
            try
            {
                // Validate input
                if (organizationId == Guid.Empty || repositoryId == Guid.Empty || pipelineId == Guid.Empty || executionId == Guid.Empty)
                {
                    return BadRequest(new { message = "Invalid IDs provided." });
                }

                // Call service to get execution status
                Guid ticketId = _pipelineService.GetExecutionStatus(organizationId, repositoryId, pipelineId, executionId);

                // Return success response
                return Ok(new ApiResponse
                {
                    RequestName = "GetExecutionStatus",
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

    }
}
