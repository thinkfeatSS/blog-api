const pool = require('../config/db');

// Save a post
exports.savePost = async (req, res) => {
  const { post_id } = req.params;

  try {
    await pool.query('INSERT INTO saved_posts (user_id, post_id) VALUES (?, ?)', [req.user.id, post_id]);
    res.status(200).json({ message: 'Post saved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save post' });
  }
};
