using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using RabbitMQLibrary.Exceptions;
using RabbitMQLibrary.Interfaces;
using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace RabbitMQLibrary.Implementation
{
    internal class QueueConsumerHandler<TMessageConsumer, TQueueMessage> : IQueueConsumerHandler<TMessageConsumer, TQueueMessage> 
        where TMessageConsumer : IQueueConsumer<TQueueMessage> 
        where TQueueMessage : class, IQueueMessage
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<QueueConsumerHandler<TMessageConsumer, TQueueMessage>> _logger;
        private readonly string _queueName;
        private IModel _consumerRegistrationChannel;
        private string _consumerTag;
        private readonly string _consumerName;

        public QueueConsumerHandler(
            IServiceProvider serviceProvider,
            ILogger<QueueConsumerHandler<TMessageConsumer, TQueueMessage>> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _queueName = typeof(TQueueMessage).Name;
            _consumerName = typeof(TMessageConsumer).Name;
        }

        public void RegisterQueueConsumer()
        {
            _logger.LogInformation($"Registering {_consumerName} as a consumer for Queue {_queueName}");

            var scope = _serviceProvider.CreateScope();
            _consumerRegistrationChannel = scope.ServiceProvider.GetRequiredService<IQueueChannelProvider<TQueueMessage>>().GetChannel();

            var consumer = new AsyncEventingBasicConsumer(_consumerRegistrationChannel);
            consumer.Received += async (ch, ea) =>
            {
                using var linkedCts = new CancellationTokenSource();
                await HandleMessage(ch, ea, linkedCts.Token);
            };

            try
            {
                _consumerTag = _consumerRegistrationChannel.BasicConsume(_queueName, false, consumer);
            }
            catch (Exception ex)
            {
                var exMsg = $"BasicConsume failed for Queue '{_queueName}'";
                _logger.LogError(ex, exMsg);
                throw new QueueingException(exMsg);
            }

            _logger.LogInformation($"Successfully registered {_consumerName} as a Consumer for Queue {_queueName}");
        }

        public void CancelQueueConsumer()
        {
            _logger.LogInformation($"Canceling QueueConsumer registration for {_consumerName}");
            try
            {
                _consumerRegistrationChannel.BasicCancel(_consumerTag);
            }
            catch (Exception ex)
            {
                var message = $"Error canceling QueueConsumer registration for {_consumerName}";
                _logger.LogError(message, ex);
                throw new QueueingException(message, ex);
            }
        }

        private async Task HandleMessage(object ch, BasicDeliverEventArgs ea, CancellationToken cancellationToken)
        {
            _logger.LogInformation($"Received Message on Queue {_queueName}");

            var consumerScope = _serviceProvider.CreateScope();
            var consumingChannel = ((AsyncEventingBasicConsumer)ch).Model;

            IModel producingChannel = null;
            try
            {
                producingChannel = consumerScope.ServiceProvider.GetRequiredService<IChannelProvider>().GetChannel();
                var message = DeserializeMessage(ea.Body.ToArray());
                _logger.LogInformation($"MessageID '{message.MessageId}'");

                producingChannel.TxSelect();

                var consumerInstance = consumerScope.ServiceProvider.GetRequiredService<TMessageConsumer>();
                await consumerInstance.ConsumeAsync(message, cancellationToken);

                if (producingChannel.IsClosed || consumingChannel.IsClosed)
                {
                    throw new QueueingException("A channel is closed during processing");
                }

                producingChannel.TxCommit();
                consumingChannel.BasicAck(ea.DeliveryTag, false);

                _logger.LogInformation("Message successfully processed");
            }
            catch (Exception ex)
            {
                var msg = $"Cannot handle consumption of a {_queueName} by {_consumerName}'";
                _logger.LogError(ex, msg);
                RejectMessage(ea.DeliveryTag, consumingChannel, producingChannel);
            }
            finally
            {
                consumerScope.Dispose();
            }
        }

        private void RejectMessage(ulong deliveryTag, IModel consumeChannel, IModel scopeChannel)
        {
            try
            {
                if (scopeChannel != null)
                {
                    scopeChannel.TxRollback();
                    _logger.LogInformation("Rolled back the transaction");
                }

                consumeChannel.BasicReject(deliveryTag, false);
                _logger.LogWarning("Rejected queue message");
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "BasicReject failed");
            }
        }

        private static TQueueMessage DeserializeMessage(byte[] message)
        {
            var stringMessage = Encoding.UTF8.GetString(message);
            return JsonConvert.DeserializeObject<TQueueMessage>(stringMessage);
        }
    }
}
