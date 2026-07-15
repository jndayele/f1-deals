const { Worker } = require('bullmq');
const { connection } = require('../config/queues');
const prisma = require('../config/prisma');
const { invalidateCache } = require('../middleware/cache.middleware');
const logger = require('../utils/logger');

const cronWorker = new Worker('cronQueue', async (job) => {
  if (job.name === 'archive-sold-cars') {
    logger.info('Running archive-sold-cars job...');

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const carsToArchive = await prisma.car.findMany({
      where: {
        status: 'Sold',
        soldAt: { lt: fourteenDaysAgo }
      },
      select: { id: true }
    });

    if (carsToArchive.length > 0) {
      const ids = carsToArchive.map(c => c.id);
      await prisma.car.updateMany({
        where: { id: { in: ids } },
        data: { status: 'Archived', archivedAt: new Date() }
      });
      await invalidateCache('cache:cars');
      logger.info({ count: carsToArchive.length, ids }, 'Cars archived successfully');
    } else {
      logger.info('No cars to archive today.');
    }
  }
}, { connection });

cronWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Cron job failed');
});

cronWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Cron job completed');
});

module.exports = cronWorker;
