// src/controllers/postController.js

const createPool = require("../config/db");
const { validationResult } = require("express-validator");

// Create a new blog post with dynamic blocks
exports.createPost = async (req, res) => {
  const { title, author_id, category_id, blocks } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if blocks exist and are valid
  if (!blocks || !Array.isArray(blocks)) {
    return res.status(400).json({ error: "'blocks' must be an array." });
  }

  let connection;
  try {
    const pool = createPool;
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Insert the post with title, main image, author, and category
    const [postResult] = await connection.query(
      `INSERT INTO posts (title, main_image, author_id, category_id) VALUES (?, ?, ?, ?)`,
      [title, req.file?.path || null, author_id, category_id]
    );
    const postId = postResult.insertId; // Get the inserted post ID
    
    // // Process content blocks (text or images)
    const blockPromises = blocks.map(async (block, index) => {
      if (block.type === "text") {
        return connection.query(
          "INSERT INTO content_blocks (post_id, block_type, content, position) VALUES (?, ?, ?, ?)",
          [postId, "text", block.content, index + 1]
        );
      } else if (block.type === "image") {
        const imageFile = req.files[index]; // Use Multer's uploaded file for the image
        return connection.query(
          "INSERT INTO content_blocks (post_id, block_type, image_url, description, position) VALUES (?, ?, ?, ?, ?)",
          [postId, "image", imageFile.path, block.description, index + 1]
        );
      }
    });
    // const blockPromises = blocks.map(async (block, index) => {
    // });

    await Promise.all(blockPromises);
    await connection.commit();

    res.status(201).json({ message: "Post created successfully", postId });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  } finally {
    if (connection) connection.release();
  }
};

exports.getPost = async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    const pool = createPool;
    connection = await pool.getConnection();

    // Query for the post data
    const [postRows] = await connection.query(
      'SELECT * FROM posts WHERE id = ?',
      [id]
    );

    if (postRows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = postRows[0];

    // Query for the post's content blocks
    const [blocks] = await connection.query(
      'SELECT * FROM content_blocks WHERE post_id = ? ORDER BY position',
      [id]
    );

    // Send the post and its content blocks
    res.status(200).json({ post, blocks });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  } finally {
    if (connection) connection.release();
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, author_id, category_id, blocks } = req.body;

  let connection;
  try {
    const pool = createPool;
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Update the post's main fields
    await connection.query(
      `UPDATE posts SET title = ?, main_image = ?, author_id = ?, category_id = ?, updated_at = NOW() WHERE id = ?`,
      [title, req.file?.path || null, author_id, category_id, id]
    );

    // Delete existing content blocks for this post
    await connection.query('DELETE FROM content_blocks WHERE post_id = ?', [id]);

    // Insert updated content blocks
    const blockPromises = blocks.map(async (block, index) => {
      if (block.type === 'text') {
        return connection.query(
          'INSERT INTO content_blocks (post_id, block_type, content, position) VALUES (?, ?, ?, ?)',
          [id, 'text', block.content, index + 1]
        );
      } else if (block.type === 'image') {
        const imageFile = req.files[index];
        return connection.query(
          'INSERT INTO content_blocks (post_id, block_type, image_url, description, position) VALUES (?, ?, ?, ?, ?)',
          [id, 'image', imageFile?.path || block.image_url, block.description, index + 1]
        );
      }
    });

    await Promise.all(blockPromises);
    await connection.commit();

    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  } finally {
    if (connection) connection.release();
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    const pool = createPool;
    connection = await pool.getConnection();
    // Delete the post and its associated content blocks
    await connection.query('DELETE FROM posts WHERE id = ?', [id]);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  } finally {
    if (connection) connection.release();
  }
};



// Like a post
exports.likePost = async (req, res) => {
  const { post_id } = req.params;

  try {
    await pool.query("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [
      req.user.id,
      post_id,
    ]);
    res.status(200).json({ message: "Post liked" });
  } catch (error) {
    res.status(500).json({ error: "Failed to like post" });
  }
};

// // get all without content
// exports.getAll = async (req, res) => {
//   try {
//     const [posts] = await createPool.query("SELECT * FROM posts ORDER BY created_at DESC");
//     res.status(200).json({ message: "Success", posts: posts });
//   } catch (error) {
//     console.error("Error getting posts:", error);
//     res.status(200).json({ message: "error" });
//   }
// };

// get all with content
exports.getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 posts per page
  const offset = (page - 1) * limit;

  let connection;
  try {
    const pool = createPool;
    connection = await pool.getConnection();

    // Query to get paginated posts
    const [posts] = await connection.query(
      'SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    // Query to get total post count for pagination
    const [[{ total }]] = await connection.query('SELECT COUNT(*) AS total FROM posts');

    res.status(200).json({
      page,
      limit,
      totalPosts: total,
      totalPages: Math.ceil(total / limit),
      posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  } finally {
    if (connection) connection.release();
  }
};
