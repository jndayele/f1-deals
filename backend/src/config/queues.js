const { Queue } = require('bullmq');
const redis = require('./redis');

const connection = redis;

const emailQueue = new Queue('emailQueue', { connection });
const cronQueue = new Queue('cronQueue', { connection });

module.exports = {
  emailQueue,
  cronQueue,
  connection
};
