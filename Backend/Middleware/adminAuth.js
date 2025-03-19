import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const adminAuth = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized, Login Again" });
    }
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Verify the token contains admin privileges
    if (!decoded.isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied, Admins only" });
    }
    
    req.admin = decoded; // Optionally attach admin data to the request
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export default adminAuth;
