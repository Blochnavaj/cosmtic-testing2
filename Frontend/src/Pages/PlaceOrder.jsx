import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Tittle from '../Components/Tittle';

function PlaceOrder() {
  const [userInfo, setUserInfo] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', state: '', zipCode: '', country: ''
  });
  const [method, setMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const { backendUrl, token, cartItems, setCartItems, products } = useContext(ShopContext);
  const navigate = useNavigate();

  // ✅ Subtotal Calculation (Fixed Floating Point Issue)
  const subtotal = parseFloat(
    cartItems.reduce((total, item) => {
      const price = parseFloat(item.productId?.price || 0);
      const quantity = parseInt(item.quantity || 0);
      return total + price * quantity;
    }, 0).toFixed(2)
  );

  // ✅ Discount Calculation
  const discount = parseFloat((subtotal * 0.1).toFixed(2));

  // ✅ Shipping Fee Calculation
  const shippingFee = subtotal > 100 ? 0 : 10;

  // ✅ Total Calculation (Subtotal + Shipping - Discount)
  const total = parseFloat((subtotal + shippingFee - discount).toFixed(2));

  console.log(`🧾 Subtotal: ${subtotal}, Discount: ${discount}, Shipping: ${shippingFee}, Total: ${total}`);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // ✅ Initialize Razorpay Payment
  const initPay = (razorpayOrder, orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Your Store Name',
      description: 'Order Payment',
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          const verifyData = {
            paymentResponse: response,
            orderData: orderData
          };
  
          const result = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            verifyData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          if (result.data.success) {
            toast.success("Payment & Order Successful!");
            setCartItems(prev => prev.filter(item => 
              !orderData.items.some(oItem => oItem.productId === item.productId._id)
            )
            );
            navigate('/orders');
          }
        } catch (error) {
          toast.error("Payment verification failed!");
        }
      },
      theme: { color: "#000" }
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ✅ Handle Form Submit
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    // ✅ Decode User ID from Token
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.id;

    // ✅ Prepare Order Data
    const orderItems = cartItems.map(item => {
      const productId = item.productId._id;
      const product = products.find(p => p._id === productId);
      return product ? {
        productId,
        name: product.name,
        price: parseFloat(product.price.toFixed(2)),
        quantity: parseInt(item.quantity)
      } : null;
    }).filter(item => item !== null);

    if (orderItems.length === 0) {
      toast.warn("Your cart is empty. Please add items before placing an order.");
      return;
    }

    const orderData = {
      userId,
      address: userInfo,
      items: orderItems,
      amount: total,
    
    };

    try {
      setLoading(true);
      let response;

      if (method === 'cod') {
        response = await axios.post(`${backendUrl}/api/order/cod`, orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (method === 'Stripe') {
        response = await axios.post(`${backendUrl}/api/order/stripe`, orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          window.location.replace(response.data.session_url);
          return;
        }
      } else if (method === 'Razorpay') {
        response = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          initPay(response.data.order);
          return;
        }
      } else if (method === 'PayPal') {
        console.log("📤 Sending Order Data:", orderData);

        // ✅ Fix PayPal Calculation Mismatch
        const paypalOrderData = {
          ...orderData,
          subtotal: subtotal,
          discount: discount,
          shipping: shippingFee,
          total: total
        };

        response = await axios.post(`${backendUrl}/api/order/paypal`, paypalOrderData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          console.log("✅ PayPal Approval URL:", response.data.approvalUrl);
          window.location.href = response.data.approvalUrl;
          return;
        } else {
          toast.error(response.data.message || "Failed to place order.");
        }
      }

      if (response?.data?.success) {
        setCartItems(cartItems.filter(item => !orderItems.some(ordered => ordered.productId === item.productId._id)));
        toast.success("Order placed successfully!");
        navigate('/orders');
      } else {
        toast.error(response?.data?.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("❌ Error in order:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <form onSubmit={onSubmitHandler} className='container mx-auto px-4 py-10 mt-20'>
      <Tittle text1='Complete Your' text2='Order' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-10'>
        <div className='bg-white p-8 rounded-lg shadow-lg border border-gray-200'>
          <h2 className='text-2xl font-bold mb-6 text-gray-800'>Billing Details</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Object.keys(userInfo).map((key) => (
              <input required key={key} type='text' name={key} value={userInfo[key]} onChange={handleChange} placeholder={key.replace(/([A-Z])/g, ' $1').trim()} className='input-field' />
            ))}
          </div>
        </div>
        
        <div className='bg-white p-8 rounded-lg shadow-lg border border-gray-200'>
          <h2 className='text-2xl font-bold mb-6 text-gray-800'>Order Summary</h2>
          <div className='flex justify-between text-gray-700 mb-2'><span>Subtotal:</span><span className='font-medium'>${subtotal.toFixed(2)}</span></div>
          <div className='flex justify-between text-green-600 mb-2'><span>Discount (10%):</span><span className='font-medium'>-${discount.toFixed(2)}</span></div>
          <div className='flex justify-between text-gray-700 mb-2'><span>Shipping Fee:</span><span className='font-medium'>${shippingFee.toFixed(2)}</span></div>
          <div className='flex justify-between font-bold text-xl mt-4'><span>Total:</span><span className='text-gray-800'>${total.toFixed(2)}</span></div>
        </div>
      </div>

      <div className='mt-10 bg-white p-8 rounded-lg shadow-lg border border-gray-200'>
        <h2 className='text-2xl font-bold mb-6 text-gray-800'>Select Payment Method</h2>
        <div className='grid grid-cols-4 gap-6'>
          {[
            { name: 'PayPal', value: 'PayPal', img: 'https://www.paypalobjects.com/webstatic/mktg/logo-center/PP_Acceptance_Marks_for_LogoCenter_266x142.png' },
            { name: 'Stripe', value: 'Stripe', img: 'https://media.designrush.com/inspirations/656399/conversions/1-preview.jpg' },
            { name: 'Razorpay', value: 'Razorpay', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Razorpay_logo.webp' },
            { name: 'Cash On Delivery', value: 'cod', img: 'https://img.freepik.com/premium-vector/cod-icon-shipping-cash-delivery-symbol-vector-logo-template_883533-219.jpg?w=360' }
          ].map(payment => (
            <div key={payment.value} onClick={() => setMethod(payment.value)} className={`flex flex-col items-center border p-4 rounded-lg hover:shadow-lg transition transform hover:scale-105 cursor-pointer ${method === payment.value ? 'border-black' : 'border-gray-300'}`}>
              <img src={payment.img} alt={payment.name} className='w-16 h-16 object-contain' />
              <p className='mt-2 text-gray-700 font-medium'>{payment.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-10 text-center'>
        <button type='submit' className='px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold shadow-md' disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          transition: border 0.3s;
        }
        .input-field:focus {
          border-color: black;
          outline: none;
        }
      `}</style>
    </form>
  );
}

export default PlaceOrder;