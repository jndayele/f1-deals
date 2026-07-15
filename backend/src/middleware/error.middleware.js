const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = status < 500 ? err.message : 'An unexpected error occurred';

  logger.error({ err, req: { method: req.method, url: req.url } }, 'Unhandled error');

  res.status(status).json({
    success: false,
    error: { code, message }
  });
};

module.exports = errorHandler;
