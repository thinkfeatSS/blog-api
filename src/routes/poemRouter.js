const express = require('express');
const {getPoem,getPoemById,createPoem,updatePoem,deletePoem} = require('../controllers/poemController');

const router  = express.Router();

// GET
router.get('/poem',getPoem);
router.get('/poem/:id',getPoemById); // Update example
// POST
router.post('/poem',createPoem);
// PUT
router .put('/poem/:id',updatePoem); // Update example
// DELETE
router.delete('/poem/:id',deletePoem); // Delete example


module.exports = router ;