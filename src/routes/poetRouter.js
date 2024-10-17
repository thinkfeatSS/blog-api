const express = require('express');
const {getPoet,createPoet,updatePoet,getPoetById,deletePoet} = require('../controllers/poetController');

const router  = express.Router();

// GET
router.get('/poets',getPoet);
router.get('/poets/:id',getPoetById); // Update example
// POST
router.post('/poets',createPoet);
// PUT
router .put('/poets/:id',updatePoet); // Update example
// DELETE
router.delete('/poets/:id',deletePoet); // Delete example


module.exports = router ;