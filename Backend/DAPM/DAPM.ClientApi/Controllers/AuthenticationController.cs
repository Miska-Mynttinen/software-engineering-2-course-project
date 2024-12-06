using Microsoft.AspNetCore.Mvc;
using DAPM.ClientApi.Services.Interfaces;
using DAPM.ClientApi.Models.DTOs;
using RabbitMQLibrary.Models;
using Microsoft.Extensions.Logging;
using System;

namespace DAPM.ClientApi.Controllers
{
    [Route("authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ILogger<AuthenticationController> _logger;

        public AuthenticationController(ILogger<AuthenticationController> logger, IAuthenticationService authenticationService)
        {
            _logger = logger;
            _authenticationService = authenticationService;
        }

        // Login endpoint to authenticate and generate JWT token
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            _logger.LogInformation($"Login attempt for username: {request.Username}");

            try
            {
                // Authenticate the user and generate the token and ticketId
                var (token, ticketId, userType) = _authenticationService.Login(request.Username, request.Password, request.OrganizationId);

                _logger.LogInformation($"Login successful for username: {request.Username} and type: {userType}");
                return Ok(new { Token = token, TicketId = ticketId, UserType = userType}); // Return both token and ticketId
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning($"Login failed for username: {request.Username}. Error: {ex.Message}");
                return Unauthorized(new { message = ex.Message });
            }
        }



        // Logout endpoint (optional, placeholder for future enhancements)
        [HttpPost("logout")]
        public IActionResult Logout([FromHeader] string token)
        {
            // Example: Add logic to blacklist or invalidate the token (if needed)
            _authenticationService.RevokeToken(token); // Example method for revocation
            return Ok(new { message = "Logged out successfully" });
        }
        // Token validation endpoint
        [HttpGet("validate")]
        public IActionResult ValidateToken([FromHeader(Name = "Authorization")] string authorizationHeader)
        {
            if (authorizationHeader?.StartsWith("Bearer ") ?? false)
            {
                var token = authorizationHeader.Substring(7);
                if (_authenticationService.ValidateJwtToken(token))
                {
                    return Ok(new { message = "Token is valid" });
                }
                else
                {
                    return Unauthorized(new { message = "Invalid or expired token" });
                }
            }
            else
            {
                return BadRequest(new { message = "Invalid Authorization header" });
            }
        }
    }
}
