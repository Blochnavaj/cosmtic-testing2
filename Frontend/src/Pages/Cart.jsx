import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Tittle from '../Components/Tittle'

function Cart() {
  const { currency, cartItems, fetchCart, addToCart, removeFromCart, deleteFromCart } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart(); // ✅ Fetch the latest cart data from the backend
  }, []);

  // ✅ Subtotal Calculation
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.productId?.price || 0;
    const quantity = item.quantity || 0;
    return total + price * quantity;
  }, 0);

  // ✅ Discount and Shipping Calculation
  const discount = subtotal * 0.1;
  const shippingFee = subtotal > 100 ? 0 : 10;
  const totalPrice = parseFloat((subtotal - discount + shippingFee).toFixed(2)); // ✅ Ensure consistent rounding

  // ✅ Handle Quantity Updates
  const handleAddToCart = (productId) => {
    addToCart(productId);
    fetchCart(); // ✅ Refresh cart after update
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    fetchCart(); // ✅ Refresh cart after update
  };

 

  return (
    <div className="container mx-auto px-4 py-10 mt-24">
      <h1 className="text-2xl font-bold mb-5 text-center"> 
        <Tittle text1={'Your'} text2={'Cart'} />
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty 😞</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {cartItems.map((item) => (
            <div key={item.productId._id} className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-100 p-4 rounded-lg w-full">
              {/* ✅ Product Image */}
              <img
                src={item.productId.image[0] || "https://via.placeholder.com/50"}
                alt={item.productId.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
              />

              {/* ✅ Product Details */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-semibold">{item.productId.name}</h2>
                <p className="text-gray-600">
                  {currency} {item.productId?.price?.toFixed(2) || "0.00"}
                </p>
              </div>

              {/* ✅ Quantity Controls */}
              <div className="flex items-center mt-3 sm:mt-0">
                <button
                  onClick={() => handleRemoveFromCart(item.productId._id)}
                  className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded-l"
                >
                  -
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() => handleAddToCart(item.productId._id)}
                  className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded-r"
                >
                  +
                </button>
              </div>

          
            </div>
          ))}
        </div>
      )}

      {/* ✅ Total Price & Checkout */}
      {cartItems.length > 0 && (
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg w-full sm:w-96 mx-auto">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-3">Order Summary</h2>
          <div className="mt-4 text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{currency} {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount (10%):</span>
              <span>-{currency} {discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>{currency} {shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <span>Total:</span>
              <span>{currency} {totalPrice}</span>
            </div>
          </div>
          <button onClick={() => navigate("/place-order")} className="mt-5 w-full bg-black text-white rounded-lg py-2">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
