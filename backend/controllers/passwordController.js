const User = require('../models/User');
const crypto = require('crypto');
const { sendEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');

const passwordController = {
    // Request password reset
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                // For security reasons, don't reveal if email exists
                return res.json({
                    success: true,
                    message: 'If your email is registered, you will receive password reset instructions.'
                });
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

            // Save reset token and expiry to user
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = resetTokenExpiry;
            await user.save();

            // Create reset link
            console.log(process.env.FRONTEND_URL);
            const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

            // Send password reset email
            await sendEmail(email, 'passwordReset', { resetLink });

            res.json({
                success: true,
                message: 'If your email is registered, you will receive password reset instructions.'
            });

        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({
                success: false,
                message: 'Error processing password reset request'
            });
        }
    },

    // Verify reset token
    verifyResetToken: async (req, res) => {
        try {
            const { token } = req.params;

            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Password reset link is invalid or has expired'
                });
            }

            res.json({
                success: true,
                message: 'Token is valid'
            });

        } catch (error) {
            console.error('Token verification error:', error);
            res.status(500).json({
                success: false,
                message: 'Error verifying reset token'
            });
        }
    },

    // Reset password
    resetPassword: async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Password reset link is invalid or has expired'
                });
            }

            // Update password
            user.password = password;

            // Clear reset token and expiry
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            res.json({
                success: true,
                message: 'Password has been reset successfully'
            });

        } catch (error) {
            console.error('Password reset error:', error);
            res.status(500).json({
                success: false,
                message: 'Error resetting password'
            });
        }
    }
};

module.exports = passwordController; 