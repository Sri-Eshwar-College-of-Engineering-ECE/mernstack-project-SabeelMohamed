
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  type: String,
  price: Number,
  quantity: Number,
  image: String, 
  description: String,
  contactNumber: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  farmerId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('FarmerProduct', productSchema);
