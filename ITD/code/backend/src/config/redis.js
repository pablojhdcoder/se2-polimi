const redis = require('redis');
require('dotenv').config();

let client = null;

const createClient = async () => {
  if (client) {
    return client;
  }

  client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('Too many Redis reconnection attempts');
          return new Error('Too many retries');
        }
        return Math.min(retries * 50, 500);
      }
    }
  });

  client.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  client.on('connect', () => {
    console.log('Connected to Redis');
  });

  client.on('ready', () => {
    console.log('Redis client ready');
  });

  await client.connect();
  return client;
};

const getClient = async () => {
  if (!client) {
    await createClient();
  }
  return client;
};

const closeConnection = async () => {
  if (client) {
    await client.quit();
    client = null;
  }
};

// Helper functions for common operations
const cache = {
  get: async (key) => {
    const redisClient = await getClient();
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  },
  
  set: async (key, value, ttl = null) => {
    const redisClient = await getClient();
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await redisClient.setEx(key, ttl, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
  },
  
  del: async (key) => {
    const redisClient = await getClient();
    await redisClient.del(key);
  },
  
  exists: async (key) => {
    const redisClient = await getClient();
    return await redisClient.exists(key);
  }
};

module.exports = {
  createClient,
  getClient,
  closeConnection,
  cache
};
