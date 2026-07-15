const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.public.controller');
const { reviewLimiter } = require('../middleware/rateLimit.middleware');
const { cacheMiddleware } = require('../middleware/cache.middleware');

router.post('/', reviewLimiter, reviewController.submitReview);
router.get('/', cacheMiddleware('cache:reviews', 300), reviewController.getApprovedReviews);

module.exports = router;
