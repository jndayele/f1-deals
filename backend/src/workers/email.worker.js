const logger = require('../utils/logger');
const { connection } = require('../config/queues');
const transporter = require('../config/mail');
const prisma = require('../config/prisma');
const { Worker } = require('bullmq');

const emailWorker = new Worker('emailQueue', async (job) => {
  if (job.name === 'send-enquiry-email') {
    const { enquiryId, name, phoneNumber, email, message, type } = job.data;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'system@f1deals.com',
      to: process.env.ADMIN_EMAIL || 'admin@f1deals.com',
      subject: `New ${type} Enquiry from ${name}`,
      text: `Name: ${name}\nPhone: ${phoneNumber}\nEmail: ${email || 'N/A'}\nMessage:\n${message}`
    });

    await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { emailSentAt: new Date() }
    });

    logger.info({ enquiryId }, 'Enquiry email delivered successfully');
  }
}, { connection });

emailWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Email job failed');
});

emailWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Email job completed');
});

module.exports = emailWorker;
