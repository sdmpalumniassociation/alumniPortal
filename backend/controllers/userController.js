const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../services/emailService');

// Add these validation functions at the top of the file
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone) => {
    // Allow only numbers, minimum 10 digits
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
};

// Add this new function to generate the next Alumni ID
const getNextAlumniId = async () => {
    const lastUser = await User.findOne({}, { alumniId: 1 })
        .sort({ alumniId: -1 });

    if (!lastUser || !lastUser.alumniId) {
        return 'SDMPAA0001';
    }

    const lastNumber = parseInt(lastUser.alumniId.slice(-4));
    const nextNumber = lastNumber + 1;
    return `SDMPAA${String(nextNumber).padStart(4, '0')}`;
};

const userController = {
    getNextAlumniId: async (req, res) => {
        try {
            const nextAlumniId = await getNextAlumniId();
            res.json({ nextAlumniId });
        } catch (error) {
            console.error('Error generating next Alumni ID:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating Alumni ID'
            });
        }
    },

    register: async (req, res) => {
        try {
            const {
                fullName,
                email,
                password,
                graduationYear,
                branch,
                countryCode,
                phone,
                whatsappNumber
            } = req.body;

            // Email validation
            if (!validateEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter a valid email address'
                });
            }

            // Check if email already exists
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already registered'
                });
            }

            // Phone validation
            if (!validatePhone(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number must be 10 digits'
                });
            }

            // Check if phone already exists
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number is already registered'
                });
            }

            // WhatsApp number validation (if different from phone)
            if (whatsappNumber !== phone && !validatePhone(whatsappNumber)) {
                return res.status(400).json({
                    success: false,
                    message: 'WhatsApp number must be 10 digits'
                });
            }

            // Get next alumni ID
            const alumniId = await getNextAlumniId();

            // Create user
            const user = new User({
                fullName,
                email,
                password,
                graduationYear,
                branch,
                alumniId,
                countryCode,
                phone,
                whatsappNumber
            });

            await user.save();

            // Generate token
            const token = generateToken(user._id, user.role);

            // Send welcome email
            try {
                await sendEmail(email, 'registration', {
                    fullName,
                    alumniId,
                    email,
                    branch,
                    graduationYear
                });
            } catch (emailError) {
                console.error('Error sending welcome email:', emailError);
                // Continue with registration even if email fails
            }

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    alumniId: user.alumniId
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Error in registration'
            });
        }
    },

    login: async (req, res) => {
        try {
            const { identifier, password } = req.body;

            // Check if user exists with email, alumniId, or phone
            const user = await User.findOne({
                $or: [
                    { email: identifier },
                    { alumniId: identifier },
                    { phone: identifier }
                ]
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = generateToken(user._id, user.role);

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
                user: userResponse
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Login failed',
                error: error.message
            });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({}, '-password');
            const transformedUsers = users.map(user => ({
                id: user._id,
                fullName: user.fullName,
                branch: user.branch,
                graduatedYear: user.graduationYear,
                currentPosition: user.currentPosition,
                imageUrl: user.imageUrl,
                technicalExpertise: user.technicalExpertise

            }));

            res.status(200).json({
                success: true,
                users: transformedUsers
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching users',
                error: error.message
            });
        }
    },

    getUserById: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId, '-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const transformedUser = {
                id: user._id,
                fullName: user.fullName,
                alumniId: user.alumniId,
                graduatedYear: user.graduationYear,
                branch: user.branch,
                currentPosition: user.currentPosition || 'Not specified',
                company: user.company || 'Not specified',
                technicalExpertise: user.technicalExpertise || [],
                education: user.education || [],
                linkedIn: user.linkedIn || '',
                address: user.address || '',
                email: user.email,
                phone: user.hidePhone ? "Hidden" : `${user.countryCode} ${user.phone}`,
                whatsappNumber: user.hidePhone ? "Hidden" : `${user.countryCode} ${user.whatsappNumber}`,
                imageUrl: user.imageUrl
            };

            res.status(200).json({
                success: true,
                user: transformedUser
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching user details',
                error: error.message
            });
        }
    },

    getUserProfile: async (req, res) => {
        try {
            const user = await User.findById(req.userId).select('-password');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            res.json({
                success: true,
                user
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching profile'
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.userId;

            // Parse the JSON data from FormData
            const userData = JSON.parse(req.body.userData);

            // Check for existing email and phone
            if (userData.email) {
                const existingEmail = await User.findOne({ email: userData.email, _id: { $ne: userId } });
                if (existingEmail) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email is already associated with another account'
                    });
                }
            }

            if (userData.phone) {
                const existingPhone = await User.findOne({ phone: userData.phone, _id: { $ne: userId } });
                if (existingPhone) {
                    return res.status(400).json({
                        success: false,
                        message: 'Phone number is already associated with another account'
                    });
                }
            }

            // Get the current user to preserve the imageUrl if no new image is uploaded
            const currentUser = await User.findById(userId);
            if (!currentUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Prepare update data
            const updateData = {
                ...userData,
                hidePhone: userData.hidePhone === true || userData.hidePhone === 'true',
                education: Array.isArray(userData.education) ? userData.education : [],
                technicalExpertise: Array.isArray(userData.technicalExpertise) ? userData.technicalExpertise : [],
                imageUrl: currentUser.imageUrl // Preserve existing imageUrl by default
            };

            // Add new image URL if file was uploaded
            if (req.file && req.file.location) {
                updateData.imageUrl = req.file.location;
            }

            // Update user
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            ).select('-password');

            res.json({
                success: true,
                message: 'Profile updated successfully',
                user: updatedUser
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating profile',
                error: error.message
            });
        }
    },

    togglePhoneVisibility: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            user.hidePhone = !user.hidePhone;
            await user.save();

            res.json({
                success: true,
                message: 'Phone visibility updated',
                hidePhone: user.hidePhone
            });
        } catch (error) {
            console.error('Toggle phone visibility error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating phone visibility'
            });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const userId = req.userId;
            const { currentPassword, newPassword } = req.body;

            // Find user
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Verify current password
            const isPasswordValid = await user.comparePassword(currentPassword);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Validate new password length
            if (newPassword.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 8 characters long'
                });
            }

            // Update password
            user.password = newPassword;
            await user.save();

            res.json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            console.error('Update password error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating password',
                error: error.message
            });
        }
    }
};

module.exports = userController;

