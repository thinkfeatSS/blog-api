const pool = require('../config/db');

// Add hashtags to a post
exports.addHashtags = async (req, res) => {
  const { post_id } = req.params;
  const { hashtags } = req.body;

  try {
    for (const hashtag of hashtags) {
      const [existingHashtag] = await pool.query('SELECT * FROM hashtags WHERE name = ?', [hashtag]);
      let hashtagId;

      if (existingHashtag.length > 0) {
        hashtagId = existingHashtag[0].id;
      } else {
        const [newHashtag] = await pool.query('INSERT INTO hashtags (name) VALUES (?)', [hashtag]);
        hashtagId = newHashtag.insertId;
      }

      await pool.query('INSERT INTO post_hashtags (post_id, hashtag_id) VALUES (?, ?)', [post_id, hashtagId]);
    }

    res.status(201).json({ message: 'Hashtags added' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add hashtags' });
  }
};
