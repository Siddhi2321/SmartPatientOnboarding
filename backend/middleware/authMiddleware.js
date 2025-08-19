const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.staff = await Staff.findById(decoded.id).select('-password');

            if (!req.staff) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.staff && (req.staff.role === 'admin' || req.staff.role === 'superadmin')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};


module.exports = { protect, admin };