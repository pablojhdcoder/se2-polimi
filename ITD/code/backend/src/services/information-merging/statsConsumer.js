const amqp = require('amqplib');
const pathService = require('../path-management/pathService');

const startStatsConsumer = async () => {
    try {
        const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();

        connection.on('error', (err) => {
            console.error('[RabbitMQ] Consumer connection error:', err.message);
        });
        connection.on('close', () => {
            console.warn('[RabbitMQ] Consumer connection closed');
        });

        const queue = 'path_stats_update';
        await channel.assertQueue(queue, { durable: true });

        console.log(`[RabbitMQ] Consumer started for queue: ${queue}`);

        channel.consume(queue, async (msg) => {
            if (msg === null) return;
            try {
                const body = JSON.parse(msg.content.toString());
                const pathId = body.pathId;
                if (!pathId) {
                    console.warn('[RabbitMQ] Message missing pathId, nacking');
                    channel.nack(msg, false, false);
                    return;
                }
                console.log(`[RabbitMQ] Processing stats update for path: ${pathId}`);
                await pathService.updatePathStats(pathId);
                channel.ack(msg);
            } catch (error) {
                console.error('[RabbitMQ] Error processing message:', error.message);
                channel.nack(msg, false, false);
            }
        });
    } catch (error) {
        console.error('[RabbitMQ] Consumer failed to start:', error);
    }
};

module.exports = { startStatsConsumer };
