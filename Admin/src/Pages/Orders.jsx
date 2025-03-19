import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import assets from '../assets/admin_assets/assets';

function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ✅ Fetch Orders
 // ✅ Fetch Orders (Newest First)
const fetchAllOrders = async () => {
  if (!token) return;
  try {
    const response = await axios.post(
      `${backendUrl}/api/order/list`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("✅ Orders Fetched:", response.data);

    // ✅ Sort orders by date (newest first)
    const sortedOrders = response.data.order.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setOrders(sortedOrders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error.response?.data || error.message);
    toast.error(error.message);
  }
};


  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // ✅ Update Order Status
  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);

    try {
      await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAllOrders(); // Refresh data
    } catch (error) {
      console.error("❌ Error updating order status:", error.response?.data || error.message);
      toast.error(error.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ✅ Calculate Total Price from Items
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const price = item?.price || 0;
      const quantity = item?.quantity || 0;
      return total + price * quantity;
    }, 0).toFixed(2);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Orders Panel</h2>

      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 shadow-lg rounded-lg bg-white">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="border-b px-4 py-3 text-left">Order ID</th>
                <th className="border-b px-4 py-3 text-left">Products</th>
                <th className="border-b px-4 py-3 text-center">Total</th>
                <th className="border-b px-4 py-3 text-center">Status</th>
                <th className="border-b px-4 py-3 text-center">Payment</th>
                <th className="border-b px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-200 cursor-pointer"
                  onClick={() =>
                    setSelectedOrder(selectedOrder?._id === order._id ? null : order)
                  }
                >
                  {/* ✅ Order ID */}
                  <td className="border-b px-4 py-3 text-sm">
                    {order._id}
                  </td>

                  {/* ✅ Products with Images */}
                  <td className="border-b px-4 py-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        
                        <p>
                          {item.name} x {item.quantity}
                        </p>
                      </div>
                    ))}
                  </td>

                  {/* ✅ Total Calculation */}
                  <td className="border-b px-4 py-3 text-center font-medium">
                    ${calculateTotal(order.items)}
                  </td>

                  {/* ✅ Order Status */}
                  <td className="border-b px-4 py-3 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      disabled={updatingOrderId === order._id}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* ✅ Payment Status + Method */}
                  <td className="border-b px-4 py-3 text-center">
                    <span
                      className={`font-semibold ${
                        order.payment ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {order.payment ? 'Paid' : 'Pending'}
                    </span>
                    <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                  </td>

                  {/* ✅ Actions */}
                  <td className="border-b px-4 py-3 text-center">
                    <button
                      onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Expandable Order Details */}
          {selectedOrder && (
            <div className="mt-6 bg-white border border-gray-200 shadow-md p-4 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Order Details
              </h3>
              <p>
                <strong>Customer:</strong>{' '}
                {`${selectedOrder.address.firstName} ${selectedOrder.address.lastName}`}
              </p>
              <p>
                <strong>Address:</strong>{' '}
                {`${selectedOrder.address.street}, ${selectedOrder.address.city}, ${selectedOrder.address.state}, ${selectedOrder.address.country} - ${selectedOrder.address.zipCode}`}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.address.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.address.email}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(selectedOrder.date).toLocaleString()}
              </p>
              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-4 px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
              >
                Close
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10">No orders found</p>
      )}
    </div>
  );
}

export default Orders;
