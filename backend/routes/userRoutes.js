const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register route
router.post('/register', userController.register);

module.exports = router; 