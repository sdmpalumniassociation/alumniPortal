const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, getAllUsers, deleteUser, getUserStats } = require('../controllers/adminController');
const { sendBroadcastEmail } = require('../controllers/broadcastController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

// Admin login route
router.post('/login', loginAdmin);

// Protected admin routes
router.get('/profile', authMiddleware, getAdminProfile);

// Protected user management routes
router.get('/users', authMiddleware, isAdmin, getAllUsers);
router.delete('/users/:userId', authMiddleware, isAdmin, deleteUser);
router.get('/stats', authMiddleware, isAdmin, getUserStats);

// Broadcast email route
router.post('/broadcast-email', authMiddleware, isAdmin, sendBroadcastEmail);

module.exports = router; 