require('dotenv').config();
const redis = require('./src/config/redis');

async function flush() {
  console.log('Flushing Redis cache...');
  await redis.flushall();
  console.log('Cache flushed.');
  process.exit(0);
}

flush();
