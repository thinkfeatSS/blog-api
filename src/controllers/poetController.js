const pool = require('../config/db');

// Get all names
exports.getPoet = async (req, res, next) => {
    try {
        // Using async/await to query the database
        const [rows] = await pool.query('SELECT * FROM poets');
        
        // Send the result back to the client
        res.json({
        success: true,
        data: rows
    });
} catch (error) {
    // Error handling
    console.error('Database query error:', error);
      res.status(500).json({
        success: false,
        message: 'Database query failed',
      });
    }
  };
// Get all names
exports.getPoetById  = async (req, res, next) => {
    const { id } = req.params;  // Get the id from the URL parameters

    try {
        // Query the database for a poet with the given id
        const [rows] = await pool.query('SELECT * FROM poets WHERE id = ?', [id]);
    
        // Check if a poet was found
        if (!rows.length) {
          return res.status(404).json({
            success: false,
            message: `No poet found with id: ${id}`,
          });
        }
    
        // Send the poet data as the response
        res.status(200).json({
          success: true,
          data: rows[0],  // Since `rows` is an array, return the first (and only) result
        });
      } catch (error) {
        // Handle any errors that occur during the database query
        console.error('Database query error:', error);
        res.status(500).json({
          success: false,
          message: 'Server error, unable to fetch poet',
        });
      }
  };
// Create names
exports.createPoet = async (req, res) => {
    // console.log(req.body);
    const { name } = req.body;
    try{
        if(!name){
            return res.status(400).json({ success: false, message: 'Please provide all fields:' });
        }

    // Insert the new user into the database using async/await
    const query = 'INSERT INTO poets (name) VALUES (?)';
    const [result] = await pool.execute(query, [name]);
    console.log(result);
     // Send success response
     res.status(201).json({
        success: true,
        message: 'data successfully received',
        poetId: result.insertId,
      });} catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error, unable to create user',
          });
      }
    

};
  
// Update name
exports.updatePoet = async (req, res) => {
    const { id } = req.params; // Get the id from the request parameters
    const { name } = req.body; // Get the new value from the request body
  
    try {
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Please provide the updated value for the poet',
        });
      }
  
      // Update the poet in the database
      const query = 'UPDATE poets SET name = ? WHERE id = ?';
      const [result] = await pool.execute(query, [name, id]);
  
      // Check if any rows were affected (i.e., if the poet was actually updated)
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: `No poet found with id: ${id}`,
        });
      }
  
      res.status(200).json({
        success: true,
        message: `Poet with id: ${id} successfully updated`,
      });
    } catch (error) {
      console.error('Error updating poet:', error);
      res.status(500).json({
        success: false,
        message: 'Server error, unable to update poet',
      });
    }
  };
  
// Delete name
exports.deletePoet = async (req, res) => {
    const { id } = req.params; // Get the id from the request parameters
  
    try {
      // Delete the poet from the database
      const query = 'DELETE FROM poets WHERE id = ?';
      const [result] = await pool.execute(query, [id]);
  
      // Check if any rows were affected (i.e., if the poet was actually deleted)
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: `No poet found with id: ${id}`,
        });
      }
  
      res.status(200).json({
        success: true,
        message: `Poet with id: ${id} successfully deleted`,
      });
    } catch (error) {
      console.error('Error deleting poet:', error);
      res.status(500).json({
        success: false,
        message: 'Server error, unable to delete poet',
      });
    }
  };
  