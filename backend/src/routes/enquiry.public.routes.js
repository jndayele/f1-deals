const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiry.public.controller');
const { enquiryLimiter } = require('../middleware/rateLimit.middleware');

router.post('/', enquiryLimiter, enquiryController.submitEnquiry);

module.exports = router;
