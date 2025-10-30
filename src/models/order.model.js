const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
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
        required: true,
        min: 1
      },
      total: { 
        type: Number,
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  shippingInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    additionalInfo: { type: String }
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'stripe'],
    default: 'cash'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderedAt: {
    type: Date,
    default: Date.now
  },
  deliveredAt: Date
}, { timestamps: true });

module.exports = mongoose.model('orders', orderSchema);
