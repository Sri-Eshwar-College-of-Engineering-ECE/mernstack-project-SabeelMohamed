const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Stripe Checkout session ID for reference
  stripeSessionId: {
    type: String,
    required: true
  },
  // Payment status returned by Stripe (e.g., 'paid')
  paymentStatus: {
    type: String,
    required: true
  },
  // Total amount charged (in paisa)
  amountTotal: {
    type: Number,
    required: true
  },
  // Buyer details collected before payment
  buyerDetails: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  // Items bought in this order
  cartItems: [
    {
      // Reference to the product
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FarmerProduct',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
