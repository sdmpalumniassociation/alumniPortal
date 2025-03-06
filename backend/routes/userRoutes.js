const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authenticateUser, userController.getUserProfile);
router.put('/profile',
    authenticateUser,
    upload.single('profileImage'),
    handleUploadError,
    userController.updateProfile
);
router.post('/toggle-phone', authenticateUser, userController.togglePhoneVisibility);
router.get('/all', authenticateUser, userController.getAllUsers);
router.get('/:id', authenticateUser, userController.getUserById);

module.exports = router; 