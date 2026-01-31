const amqp = require('amqplib');
const pathService = require('../path-management/pathService');

const startStatsConsumer = async () => {
    try {
        const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();

        const queue = 'path_stats_update';
        await channel.assertQueue(queue, { durable: true });

        console.log(`[RabbitMQ] Consumer started for queue: ${queue}`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const { pathId } = JSON.parse(msg.content.toString());
                console.log(`[RabbitMQ] Processing stats update for path: ${pathId}`);

                try {
                    // This updates the path's dynamic metrics based on new ratings/trips
                    await pathService.updatePathStats(pathId);
                    channel.ack(msg);
                } catch (error) {
                    console.error(`[RabbitMQ] Error processing path ${pathId}:`, error);
                    // Re-queue for retry if it's a transient error
                    channel.nack(msg);
                }
            }
        });
    } catch (error) {
        console.error('[RabbitMQ] Consumer failed to start:', error);
    }
};

module.exports = { startStatsConsumer };
