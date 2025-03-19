import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "$";
    const delivery_fees = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState([]); // ✅ Store cart items from backend
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    // ✅ Fetch Products from Backend
    const getProductData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error.message);
            toast.error("Failed to load products.");
        }
    };

    // ✅ Fetch Cart Data from Backend
    const fetchCart = async () => {
        try {
            if (!token) {
                setCartItems([]); // ✅ Reset cart when token is missing
                return;
            }
    
             
            const response = await axios.get(`${backendUrl}/api/cart`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
             
    
            if (response.data.success) {
                setCartItems(Array.isArray(response.data.cart) ? response.data.cart : []);
            } else {
                toast.error(response.data.message);
                setCartItems([]); // ✅ Reset cart on error
            }
        } catch (error) {
            console.error("Fetch Cart Error:", error.response?.data || error.message);
            setCartItems([]); // ✅ Reset cart on failure
            toast.error("Failed to fetch cart.");
        }
    };
    

    // ✅ Add Item to Cart (Backend API)
    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please log in first.");
                return;
            }
    
            console.log("Adding to cart:", productId);
    
            const response = await axios.post(
                `${backendUrl}/api/cart/add`,
                { productId, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
             
    
            if (response.data.success) {
                setCartItems(response.data.cart); // ✅ Update state immediately
                fetchCart(); // ✅ Ensure latest cart data is fetched
                 
            }
        } catch (error) {
            console.error("Add to Cart Error:", error.response?.data || error.message);
            toast.error("Failed to add item to cart.");
        }
    };
    

    // ✅ Remove One Item from Cart (Backend API)
    const removeFromCart = async (productId) => {
        try {
            if (!token) return;
    
            const response = await axios.post(
                `${backendUrl}/api/cart/remove`,
                { productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.data.success) {
                setCartItems(response.data.cart); // ✅ Update immediately
                 
            }
        } catch (error) {
            console.error("Remove from Cart Error:", error.response?.data || error.message);
            toast.error("Failed to remove item.");
        }
    };
    
    

    // ✅ Delete Item from Cart (Completely Remove from Cart)
    const deleteFromCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            console.log("Deleting item from cart:", productId);
    
            const response = await axios.post(
                `${backendUrl}/api/cart/delete`,
                { productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            console.log("Delete from Cart Response:", response.data);
    
            if (response.data.success) {
                setCartItems(response.data.cart); // ✅ Update state immediately
                fetchCart(); // ✅ Fetch latest cart data
                toast.success("Item deleted from cart.");
            }
        } catch (error) {
            console.error("Delete from Cart Error:", error.response?.data || error.message);
            toast.error("Failed to delete item.");
        }
    };
    

    // ✅ Get Total Cart Count
    const getCartCount = () => {
        if (!Array.isArray(cartItems)) {
            console.error("🚨 cartItems is not an array:", cartItems);
            return 0;
        }
        return cartItems.reduce((total, item) => total + (item.quantity || 0), 0); // ✅ Ensure quantity exists
    };

    // ✅ Fetch Products & Cart on Load
    useEffect(() => {
        getProductData();
        fetchCart();
    }, [token]);

    const value = {
        products,
        currency,
        delivery_fees,
        backendUrl,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        removeFromCart,
        deleteFromCart,
        getCartCount,
        setCartItems,
        fetchCart,
        token,
        setToken,
    };

    return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
