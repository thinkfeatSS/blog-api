const jwt = require('jsonwebtoken');
const connection = require('../config/db');

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send("Access denied, token missing.");
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send("Invalid token.");
        req.user = user;
        next();
    });
};

// Middleware for role-based access
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).send("Admin access only.");
    next();
};

module.exports = { authenticateToken, isAdmin };
