const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');


function authorize(requiredRoles) {
    return async (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({error: 'Access denied'});
        }
        try {
            const decoded = jwt.verify(token, 'secret_key');
            const user = await User.findById(decoded.id);
            if(!user) {
                return res.status(401).json({error: 'Invalid token'});
            }
            if(user.password !== decoded.password) {
                return res.status(401).json({error: 'Invalid token'});
            }
            if (requiredRoles && !requiredRoles.some(role => user.role.includes(role))) {
                return res.status(403).json({error: 'Access denied'});
            }
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({error: 'Invalid token'});
        }
    };
}

module.exports = authorize;
