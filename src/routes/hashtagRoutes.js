const express = require('express');
const { addHashtags } = require('../controllers/hashtagController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/:post_id/hashtags', protect, addHashtags);

module.exports = router;
