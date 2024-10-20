const express = require('express');
const { createPost, likePost, getAll, getPost, getAllPosts,updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
const multerUpload = require('../middlewares/multerConfig'); // Multer for handling file uploads


router.post('/posts', multerUpload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), createPost);
// router.get(
//     '/posts-metadata',
//     getAll
// );

// GET: Get a single post by ID
router.get('/posts/:id', getPost);


// GET: Get all posts (with pagination support)
router.get('/posts', getAllPosts);



router.post('/:post_id/like', protect, likePost);

// PUT: Update a post by ID
router.put('/posts/:id', multerUpload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]), updatePost);


// DELETE: Delete a post by ID
router.delete('/posts/:id', deletePost);

module.exports = router;
