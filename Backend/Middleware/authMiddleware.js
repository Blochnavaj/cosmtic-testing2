import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("🚨 No token provided");
            return res.status(403).json({ success: false, message: "Access Denied: No token provided" });
        }

        const token = authHeader.split(" ")[1]; // ✅ Extract only the token part

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("🚨 Token verification failed:", err.message);
                return res.status(403).json({ success: false, message: "Invalid token" });
            }
            console.log("✅ Decoded Token:", decoded);

            req.user = decoded; // ✅ Attach user data to the request
            next();
        });
    } catch (error) {
        console.error("🚨 Error in verifyToken:", error.message);
        return res.status(401).json({ success: false, message: "Invalid Token", error: error.message });
    }
};

export default verifyToken;
