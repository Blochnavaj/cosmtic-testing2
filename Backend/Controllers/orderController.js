import orderModel from "../Model/orderModel.js"
import userModel from "../Model/userModel.js";
import Stripe from 'stripe';
import  razorpay from 'razorpay';
import dotenv from 'dotenv';
import paypal from 'paypal-rest-sdk' 

dotenv.config();

//global veriables 
const currency = "USD"
const deliveryCharge = 10

//gateway intialize 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
  key_id : process.env.RAZORPAY_KEY_ID,
  key_secret : process.env.RAZORPAY_SECRET
})
paypal.configure({
  "mode" : "sandbox",
  "client_id" : process.env.PAYPAL_CLIENT_ID,
  "client_secret" : process.env.PAYPAL_SECRET_KEY
})


//place order using  COD method 
const placeOrderCOD = async (req,res) => {
   try {
      const {userId, amount , address, items} = req.body

      const orderData ={
        userId,
        amount, items,
        address, 
        paymentMethod : "COD",
        payment : false,
        date : Date.now()
      }

      const newOrder = new orderModel(orderData);

      await newOrder.save();

      await userModel.findByIdAndUpdate(userId,{cartData : {}});

      res.json({ success : true , message: "Order  placed  successfully", order: newOrder });

   } catch (error) {
    res.status(500).json({ success : false ,message: "Server error", error: error.message });

   }
}


//place order using Stripe method 
const placeOrderStripe = async (req, res) => {
  try {
   const { userId, amount, address, items } = req.body;
   const { origin } = req.headers;

   const orderData = {
       userId,
       amount,
       items,
       address,
       paymentMethod: "Stripe",
       payment: false,
       date: Date.now()
   };
   
   const newOrder = new orderModel(orderData);
   await newOrder.save();

   const line_items = items.map((item) => ({
       price_data: {
           currency: currency,
           product_data: {
               name: item.name,
           },
           unit_amount: item.price * 100 // ✅ Fixed
       },
       quantity: item.quantity
   }));

   line_items.push({
       price_data: {
           currency: currency,
           product_data: {
               name: "Delivery Charges",
           },
           unit_amount: deliveryCharge * 100 // ✅ Fixed
       },
       quantity: 1
   });

   const session = await stripe.checkout.sessions.create({
       success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
       cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`, // ✅ Fixed typo
       line_items,
       mode: 'payment',
   });

   res.json({ success: true, session_url: session.url });
   
  } catch (error) {
     res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//verfiy Stripe 
const verifyStripe = async( req,res) => {
  const { orderId, success, userId } = req.query; // ✅ Read from query

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({
        success: true,
        message: "Payment verified and order updated!"
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({
        success: false,
        message: "Payment failed. Order deleted."
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

// Create Razorpay Order (No DB Entry)
const placeOrderRazorpay = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `temp_${Date.now()}`
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);
    res.json({ success: true, order: razorpayOrder });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message
    });
  }
};

// Verify Payment & Create Order
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { paymentResponse, orderData } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResponse;

    // Validate signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Create order in database
    const completeOrder = new orderModel({
      ...orderData,
      payment: true,
      paymentMethod: 'Razorpay',
      razorpay: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature
      },
      date: Date.now()
    });

    await completeOrder.save();
    res.json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

//place order using  Paypal method 
const placeOrderPaypal = async (req, res) => {
  try {
    const { userId, address, items, subtotal, discount, shipping, total } = req.body;

    // ✅ Use frontend's total
    const totalAmount = parseFloat(total.toFixed(2));

    // ✅ Create Order in Database
    const orderData = {
      userId,
      amount: totalAmount,
      items,
      address,
      paymentMethod: "PayPal",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // ✅ Prepare Items for PayPal (products, shipping, discount)
    const itemsList = items.map((item) => ({
      name: item.name || "Item",
      sku: item.sku || "item",
      price: parseFloat(item.price).toFixed(2),
      currency: "USD",
      quantity: parseInt(item.quantity),
      image: item.image 
    }));

    // Add Shipping as a line item
    itemsList.push({
      name: "Shipping Fee",
      sku: "shipping",
      price: parseFloat(shipping).toFixed(2),
      currency: "USD",
      quantity: 1,
    });

    // Add Discount as a negative line item
    if (discount > 0) {
      itemsList.push({
        name: "Discount",
        sku: "discount",
        price: (-discount).toFixed(2),
        currency: "USD",
        quantity: 1,
      });
    }

    // ✅ PayPal Payment Data
    const paymentData = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/verify-paypal?success=true&orderId=${newOrder._id}`,
        cancel_url: `${process.env.CLIENT_URL}/verify-paypal?success=false&orderId=${newOrder._id}`,
      },
      transactions: [
        {
          item_list: { items: itemsList },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
            details: {
              subtotal: (subtotal - discount + shipping).toFixed(2), // Adjusted subtotal
              shipping: "0.00", // Shipping is included in line items
            },
          },
          description: "Order Payment",
        },
      ],
    };

    // ✅ Handle PayPal payment with promises
    const payment = await new Promise((resolve, reject) => {
      paypal.payment.create(paymentData, (error, payment) => {
        if (error) reject(error);
        else resolve(payment);
      });
    });

    const approvalUrl = payment.links.find(link => link.rel === 'approval_url')?.href;
    if (!approvalUrl) throw new Error("Approval URL missing");

    res.status(200).json({ success: true, approvalUrl });

  } catch (error) {
    console.error("❌ Error in placeOrderPaypal:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Verify PayPal Payment
const verifyPaypal = async (req, res) => {
  try {
    const { orderId, success, paymentId, payerId } = req.query;

    if (!orderId || !paymentId || !payerId) {
      return res.status(400).json({ success: false, message: "Missing parameters." });
    }

    if (success === "true") {
      // ✅ Capture PayPal payment
      const captureResult = await new Promise((resolve, reject) => {
        paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
          if (error) reject(error);
          else resolve(payment);
        });
      });

      if (captureResult.state === "approved") {
        // ✅ Update order as paid
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, {
          payment: true,
          paymentDetails: {
            paymentId: captureResult.id,
            payerId: payerId,
            paymentMethod: 'PayPal',
            amount: captureResult.transactions[0].amount.total,
            currency: captureResult.transactions[0].amount.currency,
            status: captureResult.state
          }
        }, { new: true });

        console.log(`✅ Payment successful for orderId: ${orderId}`);
        return res.json({ success: true, message: "Payment verified and order updated!", order: updatedOrder });
      } else {
        throw new Error("Payment not approved");
      }
    } else {
      // ❌ Delete order if payment fails
      await orderModel.findByIdAndDelete(orderId);
      console.log(`❌ Payment failed for orderId: ${orderId}`);
      return res.json({ success: false, message: "Payment failed. Order deleted." });
    }
  } catch (error) {
    console.error("❌ Error in verifyPaypal:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//all order data for admin panel 
const allOrder = async (req, res) => {
   try {
     const order = await orderModel.find({});
     
     // ✅ Convert string to array if necessary
     order.forEach((order) => {
       order.items.forEach((item) => {
         if (!Array.isArray(item.image) && typeof item.image === 'string') {
           item.image = [item.image]; // ✅ Convert to array
         }
       });
     });
 
     res.json({
       success: true,
       order
     });
   } catch (error) {
     res.status(500).json({ success: false, message: error.message });
   }
 };


 

// user order data for  frontend 
const  userOrder = async (req,res) => {
      try {
         const {userId} = req.body
         const orders = await orderModel.find({userId})

         res.json({
            success : true,
            orders
         })
      } catch (error) {
         res.status(500).json({ success : false ,message: "Server error", error: error.message });

      }
}
 
// ✅ Update order status from admin panel
const updateStatus = async (req, res) => {
   try {
     const { orderId, status } = req.body;
 
     const updatedOrder = await orderModel.findByIdAndUpdate(
       orderId,
       { status },
       { new: true }
     );
 
     if (!updatedOrder) {
       return res.status(404).json({ success: false, message: "Order not found" });
     }
 
     res.json({ success: true, message: "Order status updated", order: updatedOrder });
   } catch (error) {
     console.error("❌ Error updating order status:", error.message);
     res.status(500).json({ success: false, message: "Server error", error: error.message });
   }
 };
 


export {placeOrderRazorpay, placeOrderStripe, updateStatus, userOrder, allOrder , placeOrderPaypal , placeOrderCOD , verifyStripe, verifyRazorpayPayment, verifyPaypal}