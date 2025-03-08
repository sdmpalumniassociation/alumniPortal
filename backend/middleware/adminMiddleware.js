const isAdmin = (req, res, next) => {
    // Check if user role exists from the decoded token
    if (!req.userRole) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (req.userRole !== 'admin' && req.userRole !== 'super_admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

module.exports = isAdmin; 