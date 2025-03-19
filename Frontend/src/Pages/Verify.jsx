import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function Verify() {
  const { token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const verifyPayment = async () => {
    try {
      if (!token) return;

      const response = await fetch(
        `${backendUrl}/api/order/verifyStripe?orderId=${orderId}&success=${success}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setCartItems([]); // ✅ Clear cart on success
        setStatus('success');
        toast.success('Payment successful! Order confirmed.');
      } else {
        setStatus('failed');
        toast.error('Payment failed. Order cancelled.');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      toast.error('Something went wrong while verifying payment.');
      setStatus('failed');
    }
  };

  useEffect(() => {
    if (token && orderId) {
      verifyPayment();
    }
  }, [token, orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-24">
      {status === 'success' && (
        <div className="flex flex-col items-center bg-green-100 border border-green-400 text-green-700 px-4 py-6 rounded-lg shadow-md">
          <FaCheckCircle className="w-16 h-16 text-green-600 mb-4" />
          <h2 className="text-2xl font-semibold">Payment Successful!</h2>
          <p className="mt-2 text-center">
            Your order has been confirmed. Thank you for shopping with us!
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            View Orders
          </button>
        </div>
      )}

      {status === 'failed' && (
        <div className="flex flex-col items-center bg-red-100 border border-red-400 text-red-700 px-4 py-6 rounded-lg shadow-md">
          <FaTimesCircle className="w-16 h-16 text-red-600 mb-4" />
          <h2 className="text-2xl font-semibold">Payment Failed!</h2>
          <p className="mt-2 text-center">
            There was an issue with your payment. Please try again.
          </p>
          <button
            onClick={() => navigate('/cart')}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry Payment
          </button>
        </div>
      )}

      {status === null && (
        <div className="text-gray-600 text-lg">Verifying payment, please wait...</div>
      )}
    </div>
  );
}

export default Verify;
