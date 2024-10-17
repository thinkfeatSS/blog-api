const pool = require('../config/db');

// Track post analytics (views, likes, shares)
exports.trackAnalytics = async (req, res) => {
  const { post_id } = req.params;

  try {
    const [analytics] = await pool.query('SELECT * FROM analytics WHERE post_id = ?', [post_id]);
    res.status(200).json(analytics[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
