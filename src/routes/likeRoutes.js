
const express = require('express');
const { likePost, unlikePost, getPostLikes } = require('../controllers/likeController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Like a post
router.post('/:post_id/like', protect, likePost);

// Unlike a post
router.delete('/:post_id/unlike', protect, unlikePost);

// Get total likes for a post
router.get('/:post_id/likes', getPostLikes);

module.exports = router;
