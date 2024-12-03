import jwt from 'jsonwebtoken';


// Helper function to generate JWT auth token
export const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};

// Helper function to generate JWT refresh token
export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists and is formatted correctly
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or invalid header format!' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Additional check: Ensure the email in the token matches the request body
        if (!decoded.email || decoded.email !== req.body.email) {
            return res.status(400).json({ message: 'Email in token does not match the request body!' });
        }

        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(403).json({ message: 'Invalid or expired token!' });
    }
};
