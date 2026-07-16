const prisma = require('../config/prisma');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Basic Stats
    const [
      activeCars,
      soldCars,
      archivedCars,
      pendingReviews,
      recentListings,
    ] = await Promise.all([
      prisma.car.count({ where: { status: 'Available' } }),
      prisma.car.count({ where: { status: 'Sold' } }),
      prisma.car.count({ where: { status: 'Archived' } }),
      prisma.review.count({ where: { status: 'Pending' } }),
      prisma.car.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          media: {
            orderBy: { order: 'asc' },
            take: 1
          }
        }
      })
    ]);

    // Format recent listings media for the frontend
    const formattedRecentListings = recentListings.map(car => ({
      ...car,
      media: car.media.map(m => ({ ...m, type: m.isPhoto ? 'image' : 'video' }))
    }));

    // 2. Inventory Trends (last 6 months)
    const trends = [];
    const now = new Date();
    
    // We will gather the start and end dates for the last 6 months
    const monthQueries = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      const monthLabel = start.toLocaleDateString('en-US', { month: 'short' });

      monthQueries.push(
        Promise.all([
          prisma.car.count({ where: { createdAt: { gte: start, lte: end } } }),
          prisma.car.count({ where: { soldAt: { gte: start, lte: end } } })
        ]).then(([added, sold]) => ({
          month: monthLabel,
          added,
          sold
        }))
      );
    }

    const inventoryTrends = await Promise.all(monthQueries);

    res.status(200).json({
      success: true,
      data: {
        activeCars,
        soldCars,
        archivedCars,
        totalCars: activeCars + soldCars + archivedCars,
        pendingReviews,
        recentListings: formattedRecentListings,
        inventoryTrends
      }
    });
  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    res.status(500).json({ 
      success: false, 
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch dashboard stats' } 
    });
  }
};
