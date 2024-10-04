using DAPM.Orchestrator.Services.Models;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQLibrary.Interfaces;
using RabbitMQLibrary.Messages.Repository;
using RabbitMQLibrary.Messages.ResourceRegistry;
using RabbitMQLibrary.Models;
using System.Text.Json;

namespace DAPM.Orchestrator.Services
{
    public class IdentityService : IIdentityService
    {
        private ILogger<IdentityService> _logger;
        private string _identityConfigurationPath;
        private IServiceProvider _serviceProvider;
        private IServiceScope _serviceScope;

        public IdentityService(ILogger<IdentityService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _serviceScope = _serviceProvider.CreateScope();
            var currentDirectory = Directory.GetCurrentDirectory();
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Services");
            path = Path.Combine(path, "Configuration");
            _identityConfigurationPath = Path.Combine(path, "IdentityConfiguration.json");
        }

        public Identity GenerateNewIdentity()
        {

            Identity identity = ReadCurrentIdentity();

            identity.Id = Guid.NewGuid();
            
            string jsonString = JsonSerializer.Serialize(identity);
            File.WriteAllText(_identityConfigurationPath, jsonString);

            PostIdentityToRegistry(identity);

            return identity;
        }

        public Identity? GetIdentity()
        {
            Identity identity = ReadCurrentIdentity();

            if(identity.Id == null || !identity.Id.HasValue)
            {
                return GenerateNewIdentity();
            }
            else
            {
                PostIdentityToRegistry(identity);
                return identity;
            }
        }


        private Identity ReadCurrentIdentity()
        {
            string jsonString = File.ReadAllText(_identityConfigurationPath);
            return JsonSerializer.Deserialize<Identity>(jsonString)!;
        }

        private void PostIdentityToRegistry(Identity identity)
        {
            if (identity == null)
            {
                _logger.LogError("Identity cannot be null.");
                throw new ArgumentNullException(nameof(identity), "Identity cannot be null.");
            }

            // Check if the peer ID exists (i.e., not null or an empty Guid)
            if (identity.Id == null || identity.Id == Guid.Empty)
            {
                _logger.LogWarning("Peer ID is missing. Skipping the post to the registry.");
                return; // Skip posting if no valid peer ID is present
            }

            if (string.IsNullOrEmpty(identity.Name) || string.IsNullOrEmpty(identity.Domain))
            {
                _logger.LogError("Identity Name and Domain cannot be null or empty.");
                throw new InvalidOperationException("Identity Name and Domain must be valid non-null and non-empty strings.");
            }

            // Retrieve the post peer message producer from the service provider
            var postPeerProducer = _serviceScope.ServiceProvider.GetRequiredService<IQueueProducer<PostPeerMessage>>();

            // Create the message
            var postPeerMessage = new PostPeerMessage()
            {
                TimeToLive = TimeSpan.FromMinutes(1),
                Organization = new OrganizationDTO()
                {
                    Id = (Guid)identity.Id,
                    Name = identity.Name,
                    Domain = identity.Domain
                }
            };

            // Publish the message
            postPeerProducer.PublishMessage(postPeerMessage);
            _logger.LogInformation($"PostPeerMessage for Identity '{identity.Name}' has been published.");
        }
    }
}
