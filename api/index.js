const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors'); // Import the CORS middleware
const morgan = require('morgan');
const cookieParser = require('cookie-parser');  // Import cookie-parser
require('dotenv').config(); // Load environment variables

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
const categoriesRoutes = require('../src/routes/categoryRoutes');

// Create an Express instance
const app = express();
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 'loopback, linklocal, uniquelocal' : 'loopback');

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',  // Allow only your frontend's origin
  credentials: true                 // Enable cookies and credentials
}));

// Middleware to parse JSON requests
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(compression());
app.use(helmet());
app.use(morgan('dev')); // HTTP request logger
app.use(cookieParser()); 

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
app.use('/api/categories', categoriesRoutes);

// Error handling for unhandled routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  res.status(500).json({
    error: 'An unexpected error occurred!',
    message: err.message,
  });
});

// Handle unauthorized errors specifically
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid or missing token' });
  }
  res.status(500).json({ error: 'Something went wrong' });
});

// Export the app as a serverless function for Vercel
module.exports = app;

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });