const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');

// Register a new user
exports.register = (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    connection.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) return res.status(500).send("Error registering user.");
        res.status(201).send("User registered successfully.");
    });
};

// User login
exports.login = (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ?`;

    connection.query(query, [email], (err, results) => {
        if (err || results.length === 0) return res.status(404).send("User not found.");
        
        const user = results[0];
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) return res.status(400).send("Invalid password.");

        const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};
