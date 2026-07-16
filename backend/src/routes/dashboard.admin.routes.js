const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.admin.controller');
const { requireAdmin } = require('../middleware/auth.middleware');

router.use(requireAdmin);
router.get('/', dashboardController.getDashboardStats);

module.exports = router;
