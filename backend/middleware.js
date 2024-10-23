const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from headers

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, "laundryapp"); // Use the same secret used to sign the token
        req.userId = decoded._id; // Attach user ID to request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error("Token verification error:", error); // Log any errors
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken; // Export the middleware
