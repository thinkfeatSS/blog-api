// src/middlewares/multerConfig.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

// Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog', // Folder name in Cloudinary
        allowed_formats: ['jpeg', 'jpg', 'png'], // Only allow image formats
        // transformation: [{ width: 800, height: 600, crop: 'limit' }] // Resize images
    },
});

// Create the Multer upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
