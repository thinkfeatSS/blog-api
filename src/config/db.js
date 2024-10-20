const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on the traffic and database limits
    queueLimit: 0
  });

  // Test the connection
pool.getConnection()
.then(() => console.log('Database connected successfully!'))
.catch(err => console.error('Database connection failed:', err.message));


module.exports = pool;