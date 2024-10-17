const pool = require('../config/db');

exports.getAlphabet = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM alphabets');
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}
// try {
    //     if (!rows.length) {
        //         return res.status(404).json({
            //             success: false,
            //             message: 'Alphabet not found'
            //         });}
            //       // Send the alphabet data as the response
            //       res.status(200).json({
                //         success: true,
                //         data: rows[0],  // Since `rows` is an array, return the first (and only) result
                //       });
exports.getAlphabetById = async (req, res) => {
    const { id } = req.params;
    try{
        const [rows] = await pool.query('SELECT * FROM alphabets WHERE id =?', [id]);
        if(!rows.length){
            return res.status(404).json({success: false, message: `No alphabet found with id: ${id}`});
        }
        res.status(200).json({
            success: true,
            data: rows[0],  // Since `rows` is an array, return the first (and only) result
          });
    }catch(error){console.error('Database query error:', error); res.status(500).json({success: false, message: 'Server error, unable to fetch alphabet',});}}

exports.createAlphabet = async (req, res) => {
    const { letter, content } = req.body;
    try{
        if(!letter || !content){
            return res.status(400).json({ success: false, message: 'Please provide all fields:' });
        }
        const query = 'INSERT INTO alphabets (letter, content) VALUES (?, ?)';       
        const [result] = await pool.query(query,[letter,content]);
        res.status(201).json({
            success: true,
            message: 'Alphabet created successfully',
            id: result.insertId,
        });
    }catch(error){console.error('Error registering alphabet:', error); res.status(500).json({ success: false, message: 'Server error' });}}
    exports.updateAlphabet = async (req, res) => {
        const { id } = req.params;  // Get the alphabet id from URL parameters
        const { letter, content } = req.body;  // Get new values from the request body
      
        try {
          // Ensure both letter and content are provided
          if (!letter || !content) {
            return res.status(400).json({ success: false, message: 'Please provide both letter and content' });
          }
      
          // Update the alphabet record in the database
          const query = 'UPDATE alphabet SET letter = ?, content = ? WHERE id = ?';
          const [result] = await pool.execute(query, [letter, content, id]);
      
          // Check if the row was actually updated
          if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: `No record found with id: ${id}` });
          }
      
          res.status(200).json({ success: true, message: `Alphabet record with id: ${id} updated successfully` });
        } catch (error) {
          console.error('Error updating alphabet:', error);
          res.status(500).json({ success: false, message: 'Server error, unable to update the record' });
        }
      };
      exports.deleteAlphabet = async (req, res) => {
        const { id } = req.params;  // Get the alphabet id from URL parameters
      
        try {
          // Delete the alphabet record from the database
          const query = 'DELETE FROM alphabet WHERE id = ?';
          const [result] = await pool.execute(query, [id]);
      
          // Check if the row was actually deleted
          if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: `No record found with id: ${id}` });
          }
      
          res.status(200).json({ success: true, message: `Alphabet record with id: ${id} deleted successfully` });
        } catch (error) {
          console.error('Error deleting alphabet record:', error);
          res.status(500).json({ success: false, message: 'Server error, unable to delete the record' });
        }
      };