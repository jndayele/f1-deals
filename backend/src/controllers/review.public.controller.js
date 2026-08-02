const prisma = require('../config/prisma');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');
const socket = require('../config/socket');
const { sendNewReviewNotification } = require('../utils/mailer');

exports.submitReview = async (req, res) => {
  try {
    const { name, rating, message } = req.body;
    
    if (!name || rating == null || !message) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Name, rating, and message are required' } });
    }

    const numericRating = parseInt(rating, 10);
    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Rating must be between 1 and 5' } });
    }

    const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
    
    // Check if a pending review already exists for this IP
    const existingPending = await prisma.review.count({
      where: { ipAddress, status: 'Pending' }
    });

    if (existingPending > 0) {
      return res.status(400).json({ 
        success: false, 
        error: { code: 'ALREADY_SUBMITTED', message: 'You already have a pending review.' } 
      });
    }

    const review = await prisma.review.create({
      data: { name, rating: numericRating, message, ipAddress, status: 'Pending' }
    });

    try {
      socket.getIO().emit('new_review', review);
    } catch (e) {
      console.error('Socket error emitting new_review:', e);
    }

    // Send email notification to admin asynchronously
    sendNewReviewNotification(review).catch(e => console.error('Email error:', e));


    res.status(201).json({ 
      success: true, 
      data: { 
        id: review.id, 
        message: 'Review submitted successfully and is pending approval.' 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

exports.getApprovedReviews = async (req, res) => {
  try {
    const { page, pageSize, skip, take } = getPaginationParams(req);

    const [totalCount, reviews, aggr] = await Promise.all([
      prisma.review.count({ where: { status: 'Approved' } }),
      prisma.review.findMany({
        where: { status: 'Approved' },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, rating: true, message: true, createdAt: true }
      }),
      prisma.review.aggregate({
        where: { status: 'Approved' },
        _avg: { rating: true },
        _count: { id: true }
      })
    ]);

    const averageRating = aggr._avg.rating ? parseFloat(aggr._avg.rating.toFixed(1)) : 0;
    const totalApprovedCount = aggr._count.id;

    const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
    const pendingReviewCount = await prisma.review.count({
      where: { ipAddress, status: 'Pending' }
    });
    const hasPendingReview = pendingReviewCount > 0;

    const baseResponse = formatPaginatedResponse(reviews, totalCount, page, pageSize);
    
    res.status(200).json({
      success: true,
      data: {
        ...baseResponse,
        averageRating,
        totalApprovedCount,
        hasPendingReview
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};
