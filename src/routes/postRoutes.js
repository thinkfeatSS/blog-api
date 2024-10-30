const express = require('express');
const { createPost, likePost, getAll, getPost, getAllPosts,updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// Set up Cloudinary storage for multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'blog', // Folder name in Cloudinary
//   },
// });
// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Temporary storage folder
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/posts', upload.fields([{name:'mainImage',maxCount: 1},{name:'images',maxCount: 10}]), createPost);

// router.post('/posts', upload.fields([
//     { name: 'mainImage', maxCount: 1 },
//     { name: 'images', maxCount: 10 }
// ]), createPost);
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
// router.put('/posts/:id', multerUpload.fields([
//     { name: 'mainImage', maxCount: 1 },
//     { name: 'images', maxCount: 10 }
//   ]), updatePost);


// DELETE: Delete a post by ID
router.delete('/posts/:id', deletePost);

module.exports = router;
