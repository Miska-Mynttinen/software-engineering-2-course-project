using Microsoft.AspNetCore.Mvc;
using DAPM.ClientApi.Services.Interfaces;
using DAPM.ClientApi.Models.DTOs;
using DAPM.ClientApi.Services;
using RabbitMQLibrary.Models;

namespace DAPM.ClientApi.Controllers
{
    [Route("authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        private readonly ILogger<AuthenticationService> _logger;

        public AuthenticationController(ILogger<AuthenticationService> logger, IAuthenticationService authenticationService)
        {
            _logger = logger;
            _authenticationService = authenticationService;
        }

        // Login endpoint to authenticate and generate JWT token
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {

            try
            {
                var token = _authenticationService.Login(request.Username, request.Password, request.OrganizationId);
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
