const pool = require('../config/db');

// Create a new post
exports.createPost = async (req, res) => {
  const { title, content, image_url } = req.body;

  try {
    await pool.query('INSERT INTO posts (user_id, title, content, image_url) VALUES (?, ?, ?, ?)', [
      req.user.id, title, content, image_url
    ]);
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Post creation failed' });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  const { post_id } = req.params;

  try {
    await pool.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [req.user.id, post_id]);
    res.status(200).json({ message: 'Post liked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
};
