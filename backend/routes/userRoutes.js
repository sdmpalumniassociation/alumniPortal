const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passwordController = require('../controllers/passwordController');
const authenticateUser = require('../middleware/authMiddleware');
const { upload, handleBlobUpload, handleUploadError } = require('../middleware/uploadMiddleware');

// Add this route before the registration route
router.get('/next-alumni-id', userController.getNextAlumniId);

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', passwordController.forgotPassword);
router.get('/verify-reset-token/:token', passwordController.verifyResetToken);
router.post('/reset-password/:token', passwordController.resetPassword);

// Protected routes
router.get('/profile', authenticateUser, userController.getUserProfile);
router.put('/profile',
    authenticateUser,
    upload.single('profileImage'),
    handleUploadError,
    handleBlobUpload,
    userController.updateProfile
);
router.post('/toggle-phone', authenticateUser, userController.togglePhoneVisibility);
router.get('/all', authenticateUser, userController.getAllUsers);
router.get('/:id', authenticateUser, userController.getUserById);

module.exports = router; 