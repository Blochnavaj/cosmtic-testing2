import User from "../Model/userModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const createToken = (userId) => {
    return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" }); // ✅ Ensure correct ID format
};

 
// LOGIN USER
const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ success: false, message: "User doesn't exist" });
      }

      // Compare password
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      // Generate JWT Token with "userId"
      const token = createToken(user._id);

      return res.status(200).json({
         success: true,
         message: "User login successful",
         token
      });

   } catch (error) {
      console.error("Error in loginUser:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
   }
};


// 🔹 REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Hash password before saving
        const hashPassword = await bcryptjs.hash(password, 10);

        // Create new user
        const newUser = new User({ name, email, password: hashPassword });
        await newUser.save();

        // Generate JWT Token
        const token = createToken(newUser._id);

        res.status(201).json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 🔹 ADMIN LOGIN
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if credentials match environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Sign token with `userId` for consistency
            const token = jwt.sign(
                { userId: "admin", isAdmin: true },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "30d" }
            );

            return res.status(200).json({
                success: true,
                message: "Admin login successful",
                token
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        console.error("Error in adminLogin:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { registerUser, loginUser, adminLogin };
