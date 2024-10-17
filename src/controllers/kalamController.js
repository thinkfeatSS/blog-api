const pool = require('../config/db');
// Get all Kalams
exports.getAllKalams = async (req, res) => {
  try {
    // Query to get all kalams
    const [rows] = await pool.query('SELECT * FROM kalam');

    // Send the result back
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching kalams:', error);
    res.status(500).json({ success: false, message: 'Server error, unable to fetch kalams' });
  }
};
// Get a single Kalam by ID
exports.getKalamById = async (req, res) => {
  const { id } = req.params;

  try {
    // Query to get kalam by ID
    const [rows] = await pool.query('SELECT * FROM kalam WHERE id = ?', [id]);

    // Check if kalam exists
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `No kalam found with id: ${id}` });
    }

    // Return the kalam data
    res.status(200).json({
      success: true,
      data: rows[0],  // Since we expect only one row
    });
  } catch (error) {
    console.error('Error fetching kalam:', error);
    res.status(500).json({ success: false, message: 'Server error, unable to fetch kalam' });
  }
};


// Create a new Kalam
exports.createKalam = async (req, res) => {
  const { letter, content, poet_id } = req.body;

  try {
    // Validate input
    if (!letter || !content || !poet_id) {
      return res.status(400).json({ success: false, message: 'Please provide letter, content, and poet_id' });
    }

    // Check if the poet_id exists in the poets table
    const [poet] = await pool.query('SELECT * FROM poets WHERE id = ?', [poet_id]);

    if (poet.length === 0) {
      return res.status(404).json({ success: false, message: 'No poet found with the given poet_id' });
    }

    // Insert the new kalam into the database
    const query = 'INSERT INTO kalam (letter, content, poet_id) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [letter, content, poet_id]);

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'Kalam created successfully',
      kalamId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating kalam:', error);
    res.status(500).json({ success: false, message: 'Server error, unable to create kalam' });
  }
};
// Update a Kalam by ID
exports.updateKalam = async (req, res) => {
  const { id } = req.params;
  const { letter, content, poet_id } = req.body;

  try {
    // Validate input
    if (!letter || !content || !poet_id) {
      return res.status(400).json({ success: false, message: 'Please provide letter, content, and poet_id' });
    }

    // Check if the poet_id exists
    const [poet] = await pool.query('SELECT * FROM poets WHERE id = ?', [poet_id]);

    if (poet.length === 0) {
      return res.status(404).json({ success: false, message: 'No poet found with the given poet_id' });
    }

    // Update the kalam in the database
    const query = 'UPDATE kalam SET letter = ?, content = ?, poet_id = ? WHERE id = ?';
    const [result] = await pool.execute(query, [letter, content, poet_id, id]);

    // Check if the kalam was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `No kalam found with id: ${id}` });
    }

    // Respond with success
    res.status(200).json({ success: true, message: `Kalam with id: ${id} updated successfully` });
  } catch (error) {
    console.error('Error updating kalam:', error);
    res.status(500).json({ success: false, message: 'Server error, unable to update kalam' });
  }
};

// Delete a Kalam by ID
exports.deleteKalam = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the kalam from the database
    const query = 'DELETE FROM kalam WHERE id = ?';
    const [result] = await pool.execute(query, [id]);

    // Check if the kalam was deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `No kalam found with id: ${id}` });
    }

    // Respond with success
    res.status(200).json({ success: true, message: `Kalam with id: ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting kalam:', error);
    res.status(500).json({ success: false, message: 'Server error, unable to delete kalam' });
  }
};
