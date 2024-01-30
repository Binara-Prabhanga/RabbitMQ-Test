// backend/src/consumer.ts
import { connect } from 'amqplib/callback_api';

// RabbitMQ connection details
const rabbitMQUrl = 'amqp://localhost';

// Set up RabbitMQ connection and channel for consuming
connect(rabbitMQUrl, (error, connection) => {
  if (error) {
    console.error('Error Connecting to RabbitMQ:', error.message);
    return;
  }

  // Create a channel
  connection.createChannel((channelError, channel) => {
    if (channelError) {
      console.error('Error creating RabbitMQ channel:', channelError.message);
      return;
    }

    // Declare the same queue
    const queueName = 'my_queue';
    channel.assertQueue(queueName, { durable: false });

    // Set up a consumer to receive and log messages
    channel.consume(queueName, (msg) => {
      if (msg) {
        console.log(`Received message: ${msg.content.toString()}`);
        channel.ack(msg); // Acknowledge the message
      }
    });
  });
});
