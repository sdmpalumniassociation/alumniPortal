const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../services/emailService');

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
                alumniId,
                email,
                countryCode,
                phone,
                whatsappNumber,
                password,
                graduationYear,
                branch
            } = req.body;

            // Check if user already exists with email or phone
            const existingUser = await User.findOne({
                $or: [
                    { email },
                    { phone },
                    { alumniId }
                ]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: existingUser.email === email
                        ? 'Email already registered'
                        : existingUser.alumniId === alumniId
                            ? 'Alumni ID already exists'
                            : 'Phone number already registered'
                });
            }

            // Create new user
            const user = new User({
                fullName,
                alumniId,
                email,
                countryCode,
                phone,
                whatsappNumber,
                password,
                graduationYear,
                branch
            });

            await user.save();

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
                console.error('Failed to send welcome email:', emailError);
            }

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                user: userResponse
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Registration failed',
                error: error.message
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
                workingAs: user.workingAs,
                imageUrl: user.imageUrl
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
                graduatedYear: user.graduationYear,
                branch: user.branch,
                workingAs: user.workingAs,
                expertise: user.expertise,
                education: "Education Details",
                higherStudies: "Not specified",
                email: user.email,
                phone: user.hidePhone ? "xxxxxx" : `${user.countryCode} ${user.phone}`,
                whatsappNumber: user.hidePhone ? "xxxxx" : `${user.countryCode} ${user.whatsappNumber}`,
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

            // Check for existing email and phone
            if (req.body.email) {
                const existingEmail = await User.findOne({ email: req.body.email, _id: { $ne: userId } });
                if (existingEmail) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email is already associated with another account'
                    });
                }
            }

            if (req.body.phone) {
                const existingPhone = await User.findOne({ phone: req.body.phone, _id: { $ne: userId } });
                if (existingPhone) {
                    return res.status(400).json({
                        success: false,
                        message: 'Phone number is already associated with another account'
                    });
                }
            }

            // Prepare update data
            const updateData = {
                ...req.body,
                hidePhone: req.body.hidePhone === true || req.body.hidePhone === 'true',
                education: Array.isArray(req.body.education) ? req.body.education : [],
                technicalExpertise: Array.isArray(req.body.technicalExpertise) ? req.body.technicalExpertise : []
            };

            // Update user
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            ).select('-password');

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

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
    }
};

module.exports = userController;

