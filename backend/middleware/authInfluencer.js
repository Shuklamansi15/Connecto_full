import jwt from 'jsonwebtoken';

const authInfluencer = async (req, res, next) => {
    try {
        // Express converts header keys to lowercase.
        const token = req.headers.itoken;  

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Please login again.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🚀 FIX: Attach the ID directly as 'infId' to match the controller file usage (const infId = req.infId;)
        req.infId = decoded.id; // <-- The fix is here

        next();

    } catch (error) {
        // Log error with more context
        console.error("Auth Middleware Error: Token verification failed.", error.message); 
        
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please login again.'
        });
    }
};

export default authInfluencer;