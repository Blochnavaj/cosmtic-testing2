import express from "express";
import { addToCart, removeFromCart, getCartItems, clearCart } from "../Controllers/cartController.js";
import verifyToken from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getCartItems);  
router.post("/add", verifyToken, addToCart);
router.post("/remove", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart); // ✅ Added clear cart

export default router;
