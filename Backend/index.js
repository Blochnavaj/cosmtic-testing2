import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Config/db.js";
import connectClodinary from "./Config/cloudinary.js";
import userRouter from "./Routes/userRoute.js";
import productRouter from "./Routes/productRoute.js";
import cartRoutes from "./Routes/cartRoutes.js";  
import orderRouter from "./Routes/orderRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 9000; 

connectDB();
connectClodinary();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/v1", productRouter);
app.use("/api/cart", cartRoutes); 
app.use("/api/order" , orderRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
