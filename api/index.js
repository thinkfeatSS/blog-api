const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors'); // Import the CORS middleware
const morgan = require('morgan');
// const errorHandler = require('../src/middlewares/errorHandler');
// Load environment variables
require('dotenv').config();


// Import routes
const authRoutes = require('../src/routes/authRoutes');
const postRoutes = require('../src/routes/postRoutes');
const commentRoutes = require('../src/routes/commentRoutes');
const followRoutes = require('../src/routes/followRoutes');
const likeRoutes = require('../src/routes/likeRoutes');
const hashtagRoutes = require('../src/routes/hashtagRoutes');
const adminRoutes = require('../src/routes/adminRoutes');
const analyticsRoutes = require('../src/routes/analyticsRoutes');
const savedPostRoutes = require('../src/routes/savedPostRoutes');
const searchRoutes = require('../src/routes/searchRoutes');
// Create an Express instance
const app = express();
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 'loopback, linklocal, uniquelocal' : 'loopback');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
// Enable CORS for all origins (allow cross-origin requests)
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(limiter);
app.use(morgan('dev'));  // HTTP request logger

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/hashtags', hashtagRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/savedposts', savedPostRoutes);
app.use('/api/search', searchRoutes);

// Error handling for unhandled routes
app.use((req, res) => {
  // console.log(req)
  res.status(404).json({ message: 'Route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  res.status(500).json({
    error: 'An unexpected error occurred!',
    message: err.message,  // Include error message in response
  });
});

// Export the app as a serverless function for Vercel
// module.exports = app; 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});