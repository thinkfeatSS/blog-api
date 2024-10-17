const express = require('express');
const router = express.Router();
const mehfilController = require('../controllers/mehfilController');

// Create a new mehfil
router.post('/mehfils', mehfilController.createMehfil);

// Get all mehfils
router.get('/mehfils', mehfilController.getAllMehfils);

// Get a single mehfil by ID
router.get('/mehfils/:id', mehfilController.getMehfilById);

// Update a mehfil by ID
router.put('/mehfils/:id', mehfilController.updateMehfil);

// Delete a mehfil by ID
router.delete('/mehfils/:id', mehfilController.deleteMehfil);

module.exports = router;
