const pool = require('../config/db');

// Follow a user
exports.followUser = async (req, res) => {
  const { following_id } = req.params;

  try {
    await pool.query('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)', [req.user.id, following_id]);
    res.status(200).json({ message: 'User followed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  const { following_id } = req.params;

  try {
    await pool.query('DELETE FROM follows WHERE follower_id = ? AND following_id = ?', [req.user.id, following_id]);
    res.status(200).json({ message: 'User unfollowed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};
