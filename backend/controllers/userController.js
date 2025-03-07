const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const userController = {
    register: async (req, res) => {
        try {
            const {
                fullName,
                username,
                email,
                countryCode,
                phone,
                whatsappNumber,
                password,
                graduationYear,
                branch
            } = req.body;

            // Check if user already exists with email, username, or phone
            const existingUser = await User.findOne({
                $or: [
                    { email },
                    { username },
                    { phone },
                ]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: existingUser.email === email
                        ? 'Email already registered'
                        : existingUser.username === username
                            ? 'Username already taken'
                            : 'Phone number already registered'
                });
            }

            // Create new user
            const user = new User({
                fullName,
                username,
                email,
                countryCode,
                phone,
                whatsappNumber,
                password,
                graduationYear,
                branch
            });

            await user.save();

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
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Generate JWT token
            const token = generateToken(user._id);

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
            const { fullName, email, phone, whatsappNumber, branch, graduationYear, workingAs, expertise } = req.body;
            const userId = req.userId;

            // Check for existing email
            const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already associated with another account'
                });
            }

            // Check for existing phone
            const existingPhone = await User.findOne({ phone, _id: { $ne: userId } });
            if (existingPhone) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number is already associated with another account'
                });
            }

            // Prepare update object
            const updateData = {
                fullName,
                email,
                phone,
                whatsappNumber,
                branch,
                graduationYear,
                workingAs,
                expertise
            };

            // If there's a file uploaded, add the image URL
            if (req.file) {
                updateData.imageUrl = req.file.filename;
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true }
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
                message: 'Error updating profile'
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

