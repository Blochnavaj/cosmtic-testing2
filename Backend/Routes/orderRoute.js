import express from 'express';
const orderRouter = express.Router();
import { allOrder, userOrder, placeOrderRazorpay, updateStatus, placeOrderStripe, placeOrderPaypal, placeOrderCOD, verifyStripe, verifyRazorpayPayment, verifyPaypal } from '../Controllers/orderController.js';
import adminAuth from '../Middleware/adminAuth.js';
import verifyToken from '../Middleware/authMiddleware.js';
// Admin features
orderRouter.post('/list', adminAuth, allOrder);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment features (FIXED ROUTE PATH SPACES)
orderRouter.post('/stripe', verifyToken, placeOrderStripe);
orderRouter.post('/paypal', verifyToken, placeOrderPaypal);
orderRouter.post('/cod', verifyToken, placeOrderCOD);
orderRouter.post('/razorpay', verifyToken, placeOrderRazorpay); // Should be `authUser`

// User feature
orderRouter.post('/userorders', verifyToken, userOrder);

//verfiy payment 
orderRouter.post('/verifyStripe', verifyToken, verifyStripe)
orderRouter.post('/verifyRazorpay', verifyToken,  verifyRazorpayPayment)
orderRouter.post('/verifyPaypal', verifyToken,  verifyPaypal)

export default orderRouter;
