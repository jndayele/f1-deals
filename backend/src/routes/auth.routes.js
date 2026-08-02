const express = require('express');
const router = express.Router();
const { changePassword } = require('../controllers/auth.controller');
const { requireAdmin } = require('../middleware/auth.middleware');

// POST /api/v1/auth/change-password
// Protected — requires a valid Supabase JWT
router.post('/change-password', requireAdmin, changePassword);

module.exports = router;
