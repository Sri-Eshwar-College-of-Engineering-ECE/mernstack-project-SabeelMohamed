const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phoneNumber: String,
  location: String
});

module.exports = mongoose.model('Buyer', buyerSchema);
