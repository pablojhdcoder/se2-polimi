const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Successfully connected to Redis');
});

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        try {
            await redisClient.connect();
        } catch (error) {
            console.error('Could not establish a connection with Redis:', error);
        }
    }
    return redisClient;
};

module.exports = {
    redisClient,
    connectRedis
};
