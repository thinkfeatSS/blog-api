const express = require('express');
const { trackAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:post_id/analytics', protect, trackAnalytics);

module.exports = router;
