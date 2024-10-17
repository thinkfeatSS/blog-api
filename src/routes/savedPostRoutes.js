const express = require('express');
const { savePost } = require('../controllers/savedPostController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/:post_id/save', protect, savePost);

module.exports = router;
