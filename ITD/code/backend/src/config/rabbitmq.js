const amqp = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    if (!connection) {
      const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
      connection = await amqp.connect(url);
      channel = await connection.createChannel();
      console.log('Connected to RabbitMQ');

      // Define queues
      await channel.assertQueue('path_stats_update', { durable: true });
    }
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
};

const sendToQueue = (queue, message) => {
  if (!channel) {
    console.error('RabbitMQ channel not established');
    return;
  }
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
};

module.exports = {
  connectRabbitMQ,
  sendToQueue
};
