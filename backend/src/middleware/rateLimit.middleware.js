const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redis = require('../config/redis');

const handler = (req, res) => {
  res.status(429).json({
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests, please try again later.'
    }
  });
};

const createRateLimiter = (options) => {
  return rateLimit({
    ...options,
    store: new RedisStore({
      sendCommand: (...args) => redis.call(...args),
    }),
    handler
  });
};

exports.loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

exports.reviewLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
});

exports.enquiryLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
});
