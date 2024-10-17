const express = require('express');
const { searchByKeyword, searchByHashtag, searchByUser } = require('../controllers/searchController');
const router = express.Router();

// Search posts by keyword (title or content)
router.get('/posts', searchByKeyword);

// Search posts by hashtag
router.get('/posts/hashtag', searchByHashtag);

// Search posts by user
router.get('/posts/user', searchByUser);

module.exports = router;
