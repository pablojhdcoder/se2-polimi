const { connectRedis, redisClient } = require('../src/config/redis');
const { connectRabbitMQ } = require('../src/config/rabbitmq');
require('dotenv').config();

async function init() {
    console.log('--- Infrastructure Initialization ---');
    try {
        console.log('Attempting to connect to Redis...');
        await connectRedis();
        console.log('Redis Connection: [OK]');

        console.log('Attempting to connect to RabbitMQ...');
        await connectRabbitMQ();
        console.log('RabbitMQ Connection & Queues: [OK]');

        console.log('\nInfrastructure initialized successfully.');
        process.exit(0);
    } catch (error) {
        console.error('\nInfrastructure initialization FAILED:');
        console.error(error);
        process.exit(1);
    }
}

init();
