const jwt = require('jsonwebtoken');

function authorize(requiredRoles) {
    return (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ error: 'Access denied' });
        }
        try {
            const decoded = jwt.verify(token, 'secret_key');
            if (requiredRoles && !requiredRoles.some(role => decoded.role.includes(role))) {
                return res.status(403).json({ error: 'Access denied' });
            }
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    };
}

module.exports = authorize;
