const prisma = require('../config/prisma');

exports.checkHealth = async (req, res) => {
  let dbStatus = 'disconnected';
  
  try {
    // Ping DB to check connection
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    console.error('Database connection failed during health check:', error);
    dbStatus = 'error';
  }

  // TODO: Add Redis ping check when Redis is implemented

  if (dbStatus === 'connected') {
    return res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        database: dbStatus,
        timestamp: new Date().toISOString()
      }
    });
  } else {
    // If unhealthy, return 500 or 503 depending on preference, we use 500 per contract for unexpected issues, though 503 is more correct for service unavailable.
    // The contract says: 500 for unexpected server errors.
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'One or more backend services are down.'
      }
    });
  }
};
