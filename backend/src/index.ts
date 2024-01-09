// backend/src/index.ts
import express from "express";
import { connect } from "amqplib/callback_api";

const app = express();
const port = 3001;

// RabbitMQ connection details
const rabbitMQUrl = "amqp://localhost";

// Set up RabbitMQ connection and channel
connect(rabbitMQUrl, (error, connection) => {
  if (error) {
    console.error("Error connecting to RabbitMQ:", error.message);
    return;
  }

  // Create a channel
  connection.createChannel((channelError, channel) => {
    if (channelError) {
      console.error("Error creating RabbitMQ channel:", channelError.message);
      return;
    }

    // Declare a queue
    const queueName = "my_queue";
    channel.assertQueue(queueName, { durable: false });

    // Set up an endpoint to send a message to RabbitMQ
    app.get("/send", (req, res) => {
      const message = "Hello, RabbitMQ!";
      channel.sendToQueue(queueName, Buffer.from(message));
      res.send("Message sent to RabbitMQ!");
    });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
