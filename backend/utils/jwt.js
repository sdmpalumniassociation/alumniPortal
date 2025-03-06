const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'; // In production, use environment variable
const JWT_EXPIRE = '24h';

// Generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign({
        id: userId,
        role: role
    }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE
    });
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
    JWT_SECRET
}; 