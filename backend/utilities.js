const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: true, message: 'Access token is missing' }); // 401: Unauthorized
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: true, message: 'Invalid or expired token' }); // 403: Forbidden
        }

        // Check if the token contains the expected structure: _id and email
        if (!decoded || !decoded._id || !decoded.email) {
            return res.status(403).json({ error: true, message: 'Token payload is invalid' });
        }

        req.user = decoded; // Attach the decoded token to the request
        next(); // Proceed to the next middleware
    });
}

module.exports = {
    authenticateToken,
};
