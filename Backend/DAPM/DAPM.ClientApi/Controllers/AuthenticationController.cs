using Microsoft.AspNetCore.Mvc;
using DAPM.ClientApi.Services.Interfaces;
using DAPM.ClientApi.Models.DTOs;
using DAPM.ClientApi.Services;

namespace DAPM.ClientApi.Controllers
{
    [Route("authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }
private readonly ILogger<AuthenticationService> _logger;
        // Login endpoint to authenticate and generate JWT token
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                //_logger.LogInformation($"--------------------Initiating login from controller for user: {request.Username}-------------------------");
               // Ensure OrgId is a string before attempting to parse it
                string orgIdString = request.OrgId.ToString(); // Convert to string if it's a different type
                
                if (!Guid.TryParse(orgIdString, out Guid gOrgid))
                {
                    return BadRequest(new { message = "Invalid Organization ID format." });
                }
                var token = _authenticationService.Login(request.Username, request.Password, gOrgid);
                return Ok(new { Token = token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        // Logout endpoint (optional, placeholder for future enhancements)
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // For example, you can add token blacklisting logic here
            return Ok(new { message = "Logged out successfully" });
        }

        // Token validation endpoint
        [HttpGet("validate")]
        public IActionResult ValidateToken([FromHeader] string token)
        {
            if (_authenticationService.ValidateJwtToken(token))
            {
                return Ok(new { message = "Token is valid" });
            }
            else
            {
                return Unauthorized(new { message = "Invalid or expired token" });
            }
        }

    }
}
