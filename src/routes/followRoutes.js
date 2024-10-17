const express = require('express');
const { followUser, unfollowUser } = require('../controllers/followController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/:following_id/follow', protect, followUser);
router.post('/:following_id/unfollow', protect, unfollowUser);

module.exports = router;
