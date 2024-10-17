const express = require('express');
const { commentOnPost } = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/:post_id/comment', protect, commentOnPost);

module.exports = router;
