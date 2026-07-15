const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAdmin } = require('../middleware/auth.middleware');
const { loginLimiter } = require('../middleware/rateLimit.middleware');

router.post('/login', loginLimiter, authController.login);
router.post('/change-password', requireAdmin, authController.changePassword);

module.exports = router;
