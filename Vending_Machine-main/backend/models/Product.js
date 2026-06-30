const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Beverages', 'Snacks', 'Candy', 'Healthy', 'Other']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
