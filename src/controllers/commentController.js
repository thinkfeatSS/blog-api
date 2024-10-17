const pool = require('../config/db');

// Comment on a post
exports.commentOnPost = async (req, res) => {
  const { post_id } = req.params;
  const { content } = req.body;

  try {
    await pool.query('INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)', [
      req.user.id, post_id, content
    ]);
    res.status(201).json({ message: 'Comment added' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};
