const amqp = require('amqplib');
require('dotenv').config();

let connection = null;
let channel = null;

const connect = async () => {
  if (connection) {
    return { connection, channel };
  }

  try {
    const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(url);
    
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      connection = null;
      channel = null;
    });

    connection.on('close', () => {
      console.log('RabbitMQ connection closed');
      connection = null;
      channel = null;
    });

    channel = await connection.createChannel();
    
    console.log('Connected to RabbitMQ');
    return { connection, channel };
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
};

const getChannel = async () => {
  if (!channel || !connection) {
    await connect();
  }
  return channel;
};

const assertQueue = async (queueName, options = {}) => {
  const ch = await getChannel();
  return await ch.assertQueue(queueName, {
    durable: options.durable !== false,
    ...options
  });
};

const assertExchange = async (exchangeName, type, options = {}) => {
  const ch = await getChannel();
  return await ch.assertExchange(exchangeName, type, {
    durable: options.durable !== false,
    ...options
  });
};

const publish = async (queueName, message, options = {}) => {
  const ch = await getChannel();
  const messageBuffer = Buffer.from(JSON.stringify(message));
  return ch.sendToQueue(queueName, messageBuffer, {
    persistent: options.persistent !== false,
    ...options
  });
};

const publishToExchange = async (exchangeName, routingKey, message, options = {}) => {
  const ch = await getChannel();
  const messageBuffer = Buffer.from(JSON.stringify(message));
  return ch.publish(exchangeName, routingKey, messageBuffer, {
    persistent: options.persistent !== false,
    ...options
  });
};

const consume = async (queueName, callback, options = {}) => {
  const ch = await getChannel();
  return ch.consume(queueName, async (msg) => {
    if (msg) {
      try {
        const content = JSON.parse(msg.content.toString());
        await callback(content, msg);
        if (options.ack !== false) {
          ch.ack(msg);
        }
      } catch (error) {
        console.error('Error processing message:', error);
        if (options.ack !== false) {
          ch.nack(msg, false, false); // Reject and don't requeue
        }
      }
    }
  }, {
    noAck: options.noAck === true,
    ...options
  });
};

const close = async () => {
  if (channel) {
    await channel.close();
    channel = null;
  }
  if (connection) {
    await connection.close();
    connection = null;
  }
};

module.exports = {
  connect,
  getChannel,
  assertQueue,
  assertExchange,
  publish,
  publishToExchange,
  consume,
  close
};
