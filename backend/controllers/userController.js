const User = require('../models/User');

exports.register = async (req, res) => {
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

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? 'Email already registered'
                    : 'Username already taken'
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
}; 