import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Tittle from '../Components/Tittle';
import { Truck, MapPin } from "lucide-react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";   
 
function Orders() {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        console.warn("⚠ No token found");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success && response.data.orders.length > 0) {
        setOrderData(response.data.orders);
      } else {
        console.warn("⚠ No orders found.");
      }
    } catch (error) {
      console.error("❌ Error fetching orders:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='mt-20 border-t pt-16 px-4 md:px-10 lg:px-20'>
      <div className='text-2xl mb-6'>
        <Tittle text1={'my'} text2={'orders'} />
      </div>

      <div className='space-y-6'>
        {orderData.length > 0 ? (
          orderData.slice().reverse().map((order, index) => (
            <div key={index} className='p-4 border rounded-lg flex flex-col md:flex-row items-center gap-4 shadow-md'>

              {/* Show all items in the order */}
              <div className="flex flex-col gap-4 w-full">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, i) => (
                    <div key={i} className='flex gap-4 items-center'>
                      <img
                        src={item.image ||  'https://png.pngtree.com/png-vector/20191113/ourmid/pngtree-green-check-mark-icon-flat-style-png-image_1986021.jpg'}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => (e.target.src = " https://png.pngtree.com/png-vector/20191113/ourmid/pngtree-green-check-mark-icon-flat-style-png-image_1986021.jpg")}
                      />

                      <div className='flex-1'>
                        <h2 className='text-lg font-semibold'>{item.name}</h2>
                        <p className='text-gray-700'>Price: {currency}{item.price}</p>
                        <p className='text-gray-700'>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-500'>No items found in this order</p>
                )}

                {/* Order Details */}
                <div className='mt-2'>
                  <p className='text-sm text-green-600'>Status: {order.status}</p>
                  <p className='text-sm text-gray-500'>Payment method: {order.paymentMethod}</p>
                  <p className='text-sm text-gray-500'>
                    Date: <span>{new Date(order.date).toDateString()}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500'>No orders placed yet.</p>
        )}
      </div>
    </div>
  );
}

export default Orders;
