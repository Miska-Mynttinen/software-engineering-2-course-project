using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DAPM.ClientApi.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;
using BCrypt.Net;

namespace DAPM.ClientApi.Services
{
    public class AuthenticationService : IAuthenticationService // Implement the interface
    {
        private readonly string _issuer;
        private readonly string _audience;
        private readonly string _secretKey;
        private readonly ILogger<AuthenticationService> _logger;
        private readonly IQueueProducer<LoginRequest> _validateUserProducer;
        private readonly ITicketService _ticketService;
         private readonly TokenRevocationService _revocationService;

        public AuthenticationService(
            IConfiguration configuration,
            ILogger<AuthenticationService> logger,
            IQueueProducer<LoginRequest> validateUserProducer,
            ITicketService ticketService)
        {
            _issuer = configuration["Jwt:Issuer"];
            _audience = configuration["Jwt:Audience"];
            _secretKey = configuration["Jwt:SecretKey"];
            _logger = logger;
            _validateUserProducer = validateUserProducer;
            _ticketService = ticketService;
        }

        public (string token, Guid ticketId, string userType) Login(string username, string password, Guid orgId)
        {
            _logger.LogInformation($"[Login] Initiating login for user: {username} at {DateTime.UtcNow}");

            // Step 1: Create a ticket to track the response
            Guid ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);
            var validateUserMessage = new LoginRequest
            {
                TicketId = ticketId,
                Username = username,
                Password = password,
                OrgId = orgId
            };

            // Step 3: Publish the message to Resource Registry for validation
            _validateUserProducer.PublishMessage(validateUserMessage);
            _logger.LogInformation($"[Login] Validation request sent for user: {username} with ticket ID: {ticketId}");

            // Step 4: Wait for the response
            var validationResponse = _ticketService.WaitForResponse<LoginRequest>(ticketId, TimeSpan.FromMinutes(1));
            //if (validationResponse == null || !BCrypt.Net.BCrypt.Verify(password,validationResponse.Password))
            if (validationResponse == null)
            {
                _logger.LogWarning($"[Login] Login failed for user: {username}. Invalid credentials or timeout.");
                throw new UnauthorizedAccessException("Authentication failed.");
            }
            // Step 5: Generate JWT token for successful login
            var token = GenerateJwtToken(username, orgId, ticketId);
            return (token, ticketId, validationResponse.UserType);  // Return both the token and the ticketId
        }
        public string GenerateJwtToken(string username, Guid orgId,Guid ticketId)
        {
            _logger.LogInformation($"[GenerateJwtToken] Generating token for user: {username}");

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim("OrgId", orgId.ToString()),
                new Claim("ticketId", ticketId.ToString())
                // Add additional claims if needed
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1), // Token valid for 1 hour
                signingCredentials: creds
            );

            string tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            _logger.LogInformation($"[GenerateJwtToken] Token generated for user: {username}");
            return tokenString;
        }

        public bool ValidateJwtToken(string token)
        {
            _logger.LogInformation($"[ValidateJwtToken] Validating token...");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = _issuer,
                    ValidAudience = _audience,
                    IssuerSigningKey = key
                }, out var validatedToken);

                _logger.LogInformation($"[ValidateJwtToken] Token is valid.");
                return true; // Token is valid
            }
            catch (SecurityTokenExpiredException)
            {
                _logger.LogWarning($"[ValidateJwtToken] Token expired.");
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[ValidateJwtToken] Token validation failed.");
                return false;
            }
        }

         public void RevokeToken(string token)
    {
        _revocationService.RevokeToken(token); // Call the revocation service
    }
    }
}
