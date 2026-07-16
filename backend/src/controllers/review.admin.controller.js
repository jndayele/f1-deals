const prisma = require('../config/prisma');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');
const { invalidateCache } = require('../middleware/cache.middleware');
const socket = require('../config/socket');

exports.listReviews = async (req, res) => {
  try {
    const { page, pageSize, skip, take } = getPaginationParams(req);
    const { status } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }
    const [totalCount, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, rating: true, message: true, createdAt: true, status: true }
      })
    ]);

    res.status(200).json({
      success: true,
      data: formatPaginatedResponse(reviews, totalCount, page, pageSize)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid status' } });
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status }
    });

    try {
      socket.getIO().emit('review_moderated', review);
    } catch (e) {
      console.error('Socket error emitting review_moderated:', e);
    }

    await invalidateCache('cache:reviews');
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};
