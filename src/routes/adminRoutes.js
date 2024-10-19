const express = require('express');
const { getUserStats,updateUserRole } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/stats', protect, adminOnly, getUserStats);
router.post('/update-role', protect, adminOnly, updateUserRole);
module.exports = router;
