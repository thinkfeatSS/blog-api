const pool = require('../config/db');

// View user stats (admin only)
exports.getUserStats = async (req, res) => {
  try {
    const [userStats] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [postStats] = await pool.query('SELECT COUNT(*) as totalPosts FROM posts');
    
    res.status(200).json({
      totalUsers: userStats[0].totalUsers,
      totalPosts: postStats[0].totalPosts
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
