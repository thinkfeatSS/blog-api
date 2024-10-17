const pool = require('../config/db');

// CREATE - Insert a new mehfil record
exports.createMehfil = async (req, res) => {
  const { vanue, city, month, date } = req.body;

  try {
    // Validate required fields
    if (!vanue || !city || !month || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: vanue, city, month, and date',
      });
    }

    // Insert the new mehfil into the database
    const query = 'INSERT INTO mehfils (vanue, city, month, date) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(query, [vanue, city, month, date]);

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Mehfil successfully created',
      mehfilId: result.insertId, // The newly created record's ID
    });
  } catch (error) {
    console.error('Error creating mehfil:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, unable to create mehfil',
    });
  }
};

// READ - Get all mehfil records
exports.getAllMehfils = async (req, res) => {
  try {
    const query = 'SELECT * FROM mehfils';
    const [rows] = await pool.execute(query); // Executes the query and fetches the rows

    // Respond with the fetched data
    res.status(200).json({
      success: true,
      data: rows, // Returns all records (rows) fetched from the database
    });
  } catch (error) {
    console.error('Error fetching mehfils:', error);

    // Handle any errors that occur during the query
    res.status(500).json({
      success: false,
      message: 'Server error, unable to fetch mehfils',
    });
  }
};

// READ - Get a single mehfil by ID
exports.getMehfilById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM mehfils WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mehfil not found',
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0], // Return the single mehfil record
    });
  } catch (error) {
    console.error('Error fetching mehfil by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, unable to fetch mehfil',
    });
  }
};

// UPDATE - Update a mehfil record
exports.updateMehfil = async (req, res) => {
  const { id } = req.params;
  const { vanue, city, month, date } = req.body;

  try {
    // Validate required fields
    if (!vanue || !city || !month || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: vanue, city, month, and date',
      });
    }

    // Update the mehfil in the database
    const query = 'UPDATE mehfils SET vanue = ?, city = ?, month = ?, date = ? WHERE id = ?';
    const [result] = await pool.execute(query, [vanue, city, month, date, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mehfil not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mehfil updated successfully',
    });
  } catch (error) {
    console.error('Error updating mehfil:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, unable to update mehfil',
    });
  }
};

// DELETE - Delete a mehfil record
exports.deleteMehfil = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the mehfil from the database
    const query = 'DELETE FROM mehfils WHERE id = ?';
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mehfil not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mehfil deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting mehfil:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, unable to delete mehfil',
    });
  }
};
