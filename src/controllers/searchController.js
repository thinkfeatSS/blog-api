const pool = require('../config/db');

// Search posts by keyword (title or content)
exports.searchByKeyword = async (req, res) => {
  const { keyword } = req.query; // Get the search keyword from query params

  try {
    const [posts] = await pool.query(
      'SELECT p.id, p.title, p.content, p.created_at, u.username ' +
      'FROM posts p ' +
      'JOIN users u ON p.user_id = u.id ' +
      'WHERE p.title LIKE ? OR p.content LIKE ?',
      [`%${keyword}%`, `%${keyword}%`]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this keyword' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error searching posts by keyword:', error.message);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

// Search posts by hashtag
exports.searchByHashtag = async (req, res) => {
  const { hashtag } = req.query; // Get the hashtag from query params

  try {
    const [posts] = await pool.query(
      'SELECT p.id, p.title, p.content, p.created_at, u.username, h.name AS hashtag ' +
      'FROM posts p ' +
      'JOIN users u ON p.user_id = u.id ' +
      'JOIN post_hashtags ph ON p.id = ph.post_id ' +
      'JOIN hashtags h ON ph.hashtag_id = h.id ' +
      'WHERE h.name = ?',
      [hashtag]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this hashtag' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error searching posts by hashtag:', error.message);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

// Search posts by user
exports.searchByUser = async (req, res) => {
  const { username } = req.query; // Get the username from query params

  try {
    const [posts] = await pool.query(
      'SELECT p.id, p.title, p.content, p.created_at, u.username ' +
      'FROM posts p ' +
      'JOIN users u ON p.user_id = u.id ' +
      'WHERE u.username = ?',
      [username]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error searching posts by user:', error.message);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};
