const express = require('express');
const {getAlphabet,getAlphabetById,createAlphabet,updateAlphabet,deleteAlphabet} = require('../controllers/alphabetController');

const router  = express.Router();

// GET
router.get('/alphabet',getAlphabet);
router.get('/alphabet/:id',getAlphabetById); // Update example
// POST
router.post('/alphabet',createAlphabet);
// PUT
router .put('/alphabet/:id',updateAlphabet); // Update example
// DELETE
router.delete('/alphabet/:id',deleteAlphabet);`` // Delete example


module.exports = router ;