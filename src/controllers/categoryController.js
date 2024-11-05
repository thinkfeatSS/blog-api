const pool = require("../config/db");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories');
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (category.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new category (admin-only)
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Category created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a category by ID (admin-only)
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const [result] = await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a category by ID (admin-only)
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
