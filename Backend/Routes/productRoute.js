import express from 'express';
import { addProducts, removeProducts, singleProducts, listProducts } from '../Controllers/productControllers.js';
import upload from '../Middleware/multer.js';
import adminAuth from '../Middleware/adminAuth.js';
const ProductRoute = express.Router();

ProductRoute.get('/list',  listProducts);
ProductRoute.post("/add",adminAuth, upload, addProducts);
ProductRoute.post('/single', singleProducts)
ProductRoute.delete('/remove/:id', adminAuth,removeProducts)


export default ProductRoute;