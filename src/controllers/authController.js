const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register new user
exports.register = async (req, res) => {
  const { username, email, password, bio, profile_image_url } = req.body;
  const password_hash = await bcrypt.hash(password, 10);

  try {
    await pool.query('INSERT INTO users (username, email, password_hash, bio, profile_image_url) VALUES (?, ?, ?, ?, ?)', [
      username, email, password_hash, bio, profile_image_url
    ]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'User registration failed' });
  }
};

// Login user and generate JWT
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0 || !(await bcrypt.compare(password, user[0].password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
