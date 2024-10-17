const express = require('express');
const { createPost, likePost } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', protect, createPost);
router.post('/:post_id/like', protect, likePost);

module.exports = router;
