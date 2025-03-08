const Admin = require('../models/Admin');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(admin._id, admin.role);

        res.json({
            success: true,
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                fullName: admin.fullName,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Get admin profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        const formattedUsers = users.map(user => ({
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            graduationYear: user.graduationYear,
            branch: user.branch,
            status: 'Active' // You can add a status field to your user model if needed
        }));
        res.json({ success: true, users: formattedUsers });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Don't allow deleting other admins
        if (user.role === 'admin' || user.role === 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
};

const getUserStats = async (req, res) => {
    try {
        // Get total number of users
        const totalUsers = await User.countDocuments({ role: 'alumni' });

        // Get users registered in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsers = await User.countDocuments({
            role: 'alumni',
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.json({
            success: true,
            stats: {
                totalUsers,
                newUsers,
                percentageGrowth: totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : 0
            }
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics'
        });
    }
};

module.exports = {
    loginAdmin,
    getAdminProfile,
    getAllUsers,
    deleteUser,
    getUserStats
}; 