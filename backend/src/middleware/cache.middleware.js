const redis = require('../config/redis');

exports.cacheMiddleware = (keyPrefix, expirationSeconds) => {
  return async (req, res, next) => {
    const cacheKey = `${keyPrefix}:${req.originalUrl}`;
    
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
      
      const originalJson = res.json;
      res.json = function (body) {
        if (body.success) {
          redis.set(cacheKey, JSON.stringify(body), 'EX', expirationSeconds).catch(err => {
            console.error('Redis cache set error:', err);
          });
        }
        return originalJson.call(this, body);
      };
      
      next();
    } catch (err) {
      console.error('Redis cache get error:', err);
      next();
    }
  };
};

exports.invalidateCache = async (keyPrefix) => {
  try {
    let cursor = '0';
    do {
      const [newCursor, keys] = await redis.scan(cursor, 'MATCH', `${keyPrefix}:*`, 'COUNT', 100);
      cursor = newCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  } catch (err) {
    console.error('Redis cache invalidate error:', err);
  }
};
