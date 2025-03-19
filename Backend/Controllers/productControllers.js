import Product from '../Model/productModel.js';
import { v2 as cloudinary } from 'cloudinary';

// ✅ Add Product Controller
const addProducts = async (req, res) => {
    try {
        // ✅ Extract values from request body
        const { name, description, price, category, subCategory, bestSeller, date } = req.body;

        // ✅ Convert `bestSeller` to Boolean safely
        const isBestSeller = bestSeller === true || bestSeller === "true";

        // ✅ Extract images safely
        const images = ["image1", "image2", "image3", "image4"]
            .map((key) => req.files?.[key]?.[0])
            .filter(Boolean);

        let imageUrls = [];
        if (images.length > 0) {
            imageUrls = await Promise.all(
                images.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                    return result.secure_url;
                })
            );
        }

        // ✅ Create and save the product
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            subCategory,
            bestSeller: isBestSeller,
            date,
            image: imageUrls
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Get All Products
const listProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get Single Product
const singleProducts = async (req, res) => {
    try {
        const { productId } = req.body;
        const singleData = await Product.findById(productId);

        if (!singleData) {
            return res.status(400).json({ success: false, message: "Item not found" });
        }

        res.status(200).json({ success: true, message: "Item found successfully", singleData });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Delete Product
const removeProducts = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ✅ Export controllers
export { addProducts, listProducts, removeProducts, singleProducts };
