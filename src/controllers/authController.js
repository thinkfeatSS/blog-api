const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Helper function to create JWT
const createToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }  // Token expires in 1 hour
  );
};

// Register new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const password_hash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'User registration failed' });
  }
};

// Login user and set JWT in cookie
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0 || !(await bcrypt.compare(password, user[0].password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = createToken(user[0]);

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,  // Cookie cannot be accessed via JavaScript (helps mitigate XSS)
      secure: process.env.NODE_ENV === 'production',  // Cookie is only sent over HTTPS in production
      maxAge: 3600000, // Cookie expires in 1 hour
      sameSite: 'strict'  // Helps protect against CSRF attacks
    };

    // Set the cookie in the response
    res.cookie('jwt', token, cookieOptions);

    // Send success response
    res.status(200).json({
      message: 'Login successful',
      token,  // Optionally return the token as well
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Logout user by clearing the cookie
exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)  // Expire the cookie immediately
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
