const pool = require("../config/db");
// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.promise().query('SELECT * FROM categories');
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new category (admin-only)
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    await db.promise().query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Category created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
