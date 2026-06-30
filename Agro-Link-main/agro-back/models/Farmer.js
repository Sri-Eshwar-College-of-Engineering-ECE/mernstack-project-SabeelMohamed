const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phoneNumber: String,
  location: String
});

module.exports = mongoose.model('Farmer', farmerSchema);
