const pool = require('../config/db');

exports.getPoem = async (req, res) => {
    try {
        // Query to get all poems
        const [rows] = await pool.query('SELECT * FROM poems');
    
        // Send the result back
        res.status(200).json({
          success: true,
          data: rows,
        });
      } catch (error) {
        console.error('Error fetching poems:', error);
        res.status(500).json({ success: false, message: 'Server error, unable to fetch poems' });
      }
};
exports.getPoemById = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Query to get poem by ID
      const [rows] = await pool.query('SELECT * FROM poems WHERE id = ?', [id]);
  
      // Check if poem exists
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: `No poem found with id: ${id}` });
      }
  
      // Return the poem data
      res.status(200).json({
        success: true,
        data: rows[0],  // Since we expect only one row
      });
    } catch (error) {
      console.error('Error fetching poem:', error);
      res.status(500).json({ success: false, message: 'Server error, unable to fetch poem' });
    }

}
exports.createPoem = async (req, res) => {
    // Create a new poem
  const { letter, content, poet_id } = req.body;

  try {
    // Validate input
    if (!letter || !content || !poet_id) {
      return res.status(400).json({ success: false, message: 'Please provide letter, content, and poet_id' });
    }

    // Insert the new poem into the database
    const query = 'INSERT INTO poems (letter, content, poet_id) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [letter, content, poet_id]);

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'Poem created successfully',
      poemId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating poem:', error);
    res.status(500).json({ success: false, message: 'Server error, unable to create poem' });
  }
};
exports.updatePoem = async (req, res) => {
// Update a poem by ID
    const { id } = req.params;
    const { letter, content, poet_id } = req.body;

    try {
    // Validate input
    if (!letter || !content || !poet_id) {
        return res.status(400).json({ success: false, message: 'Please provide letter, content, and poet_id' });
    }

    // Update the poem in the database
    const query = 'UPDATE poems SET letter = ?, content = ?, poet_id = ? WHERE id = ?';
    const [result] = await pool.execute(query, [letter, content, poet_id, id]);

    // Check if the poem was updated
    if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: `No poem found with id: ${id}` });
    }

    // Respond with success
    res.status(200).json({ success: true, message: `Poem with id: ${id} updated successfully` });
    } catch (error) {
    console.error('Error updating poem:', error);
    res.status(500).json({ success: false, message: 'Server error, unable to update poem' });
    }};
exports.deletePoem = async (req, res) => {
    const { id } = req.params;

    try {
      // Delete the poem from the database
      const query = 'DELETE FROM poems WHERE id = ?';
      const [result] = await pool.execute(query, [id]);
  
      // Check if the poem was deleted
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: `No poem found with id: ${id}` });
      }
  
      // Respond with success
      res.status(200).json({ success: true, message: `Poem with id: ${id} deleted successfully` });
    } catch (error) {
      console.error('Error deleting poem:', error);
      res.status(500).json({ success: false, message: 'Server error, unable to delete poem' });
    }
}

// Get a single poem by ID
  

