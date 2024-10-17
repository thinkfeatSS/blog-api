const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
exports.registerUser = async (req, res) => {
  const { name, email, password, role = 'user'} = req.body;

  try {
    // Check if the user already exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(query, [name, email, hashedPassword, role]);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// User login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if the password matches
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user[0].id, email: user[0].email, role: user[0].role }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(200).json({
      success: true,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error'});
  }
};