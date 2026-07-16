require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');
const logger = require('./utils/logger');
const socket = require('./config/socket');
const emailWorker = require('./workers/email.worker');
const cronWorker = require('./workers/cron.worker');
const { cronQueue } = require('./config/queues');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Connected to PostgreSQL database successfully.');

    const server = app.listen(PORT, () => {
      logger.info({ port: PORT }, `Server is running on port ${PORT}`);
    });

    // Initialize Socket.io
    socket.init(server);

    // Schedule daily cron job — BullMQ deduplicates it in Redis so safe across instances
    await cronQueue.add('archive-sold-cars', {}, {
      repeat: { pattern: '0 0 * * *' }
    });
    logger.info('Cron job scheduled in BullMQ.');

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info({ signal }, 'Shutdown signal received. Starting graceful shutdown...');

      // 1. Stop accepting new HTTP connections
      server.close(async () => {
        logger.info('HTTP server closed. No longer accepting new connections.');

        try {
          // 2. Gracefully stop background workers (finish current job, then stop)
          await emailWorker.close();
          logger.info('Email worker closed.');

          await cronWorker.close();
          logger.info('Cron worker closed.');

          // 3. Disconnect Prisma
          await prisma.$disconnect();
          logger.info('Database disconnected. Exiting with code 0.');

          process.exit(0);
        } catch (err) {
          logger.error({ err }, 'Error during graceful shutdown');
          process.exit(1);
        }
      });

      // 4. Force shutdown after 15s if connections are still lingering
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 15000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

startServer();
