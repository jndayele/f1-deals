const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.admin.controller');
const { requireAdmin } = require('../middleware/auth.middleware');

router.use(requireAdmin);
router.get('/', reviewController.listReviews);
router.patch('/:id/status', reviewController.updateReviewStatus);

module.exports = router;
