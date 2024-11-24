using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DAPM.ClientApi.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Orchestrator.ProcessRequests;
using RabbitMQLibrary.Messages.ResourceRegistry;

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
        private readonly IUserService _userService;

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

        public string Login(string username, string password,  Guid orgId)
        {
            _logger.LogInformation($"--------------------Initiating login for user: {username}-------------------------");

            // Step 1: Create a ticket to track the response
            Guid ticketId = _ticketService.CreateNewTicket(TicketResolutionType.Json);

            // Step 2: Prepare the validation request message
            var validateUserMessage = new LoginRequest
            {
                TicketId = ticketId,
                Username = username,
                Password = password,
                OrgId = orgId
            };

            // Step 3: Publish the message to Resource Registry for validation
            _validateUserProducer.PublishMessage(validateUserMessage);
            _logger.LogInformation($"=================ValidateUserRequest published for user: {username}====================");

            // Step 4: Wait for the response
            var validationResponse = _ticketService.WaitForResponse<LoginRequest>(ticketId, TimeSpan.FromMinutes(1));
            if (validationResponse == null )
            {
                _logger.LogWarning($"Login failed for user: {username}");
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            // Step 5: Generate JWT token for successful login
            _logger.LogInformation($"Login successful for user: {username}");
            return GenerateJwtToken(username,orgId);
        }

        public string GenerateJwtToken(string username, Guid orgId)
        {
            var claims = new[] 
            {
                new Claim(ClaimTypes.Name, username)
                // Add additional claims as needed
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

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool ValidateJwtToken(string token)
        {
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

                return true; // Token is valid
            }
            catch
            {
                return false; // Token is invalid
            }
        }

        public void Logout()
        {
            _logger.LogInformation("Logout functionality is stateless for JWTs.");
        }
    }
}
