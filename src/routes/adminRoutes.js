const express = require('express');
const { getUserStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/stats', protect, adminOnly, getUserStats);

module.exports = router;
