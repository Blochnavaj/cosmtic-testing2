import Cart from "../Model/cartModel.js";
import Product from "../Model/productModel.js"

// ✅ Add Item to Cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity || 1;
            } else {
                cart.items.push({ productId, quantity: quantity || 1 });
            }
        }

        await cart.save();
        const updatedCart = await Cart.findOne({ userId }).populate("items.productId"); // ✅ Fetch latest cart
        res.status(200).json({ success: true, cart: updatedCart.items });

    } catch (error) {
        console.error("Error in addToCart:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// ✅ Remove Item from Cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex !== -1) {
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1; // ✅ Reduce quantity by 1
            } else {
                cart.items.splice(itemIndex, 1); // ✅ If quantity is 1, remove item
            }
        }

        await cart.save();
        const updatedCart = await Cart.findOne({ userId }).populate("items.productId");

        res.status(200).json({ success: true, cart: updatedCart.items });

    } catch (error) {
        console.error("🚨 Remove from Cart Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};



// ✅ Get Cart Items
export const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) return res.status(200).json({ success: true, cart: [] });

        res.status(200).json({ success: true, cart: cart.items });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Clear Cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        await Cart.deleteOne({ userId });

        res.status(200).json({ success: true, message: "Cart cleared" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
