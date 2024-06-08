import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Retrieve the token from the headers
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        console.error('Access denied: No authorization header provided');
        return res.status(401).json({ msg: "Access denied, please login" });
    }

    const token = authHeader.split(' ')[1];

    // Check if no token was provided
    if (!token) {
        console.error('Access denied: No token provided');
        return res.status(401).json({ msg: "Access denied, please login" });
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Log the decoded token for debugging
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying token:', error.message); // Log the error for debugging
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: "Token has expired, please login again" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ msg: "Token is invalid, please login again" });
        }
        return res.status(500).json({ msg: "An error occurred during authentication" });
    }
};
