const pool = require('../config/db');

// Like a post
exports.likePost = async (req, res) => {
  const { post_id } = req.params;  // Get post ID from URL params
  const user_id = req.user.id;     // Get user ID from the authenticated user

  try {
    // Check if the user already liked this post
    const [existingLike] = await pool.query('SELECT * FROM likes WHERE user_id = ? AND post_id = ?', [user_id, post_id]);

    if (existingLike.length > 0) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    // Insert the like into the database
    await pool.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [user_id, post_id]);

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error.message);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  const { post_id } = req.params;  // Get post ID from URL params
  const user_id = req.user.id;     // Get user ID from the authenticated user

  try {
    // Check if the user has liked the post
    const [existingLike] = await pool.query('SELECT * FROM likes WHERE user_id = ? AND post_id = ?', [user_id, post_id]);

    if (existingLike.length === 0) {
      return res.status(400).json({ message: 'You have not liked this post yet' });
    }

    // Remove the like from the database
    await pool.query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [user_id, post_id]);

    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Error unliking post:', error.message);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

// Get total likes for a post
exports.getPostLikes = async (req, res) => {
  const { post_id } = req.params;

  try {
    // Count the number of likes for the post
    const [likes] = await pool.query('SELECT COUNT(*) as totalLikes FROM likes WHERE post_id = ?', [post_id]);

    res.status(200).json({ totalLikes: likes[0].totalLikes });
  } catch (error) {
    console.error('Error fetching likes:', error.message);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};
