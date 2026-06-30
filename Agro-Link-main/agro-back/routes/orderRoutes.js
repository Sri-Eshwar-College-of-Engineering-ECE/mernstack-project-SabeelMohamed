
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const FarmerProduct = require('../models/FarmerProduct');

router.post('/', async (req, res) => {
    try {
      const newOrder = new Order(req.body);
      await newOrder.save();
      res.status(201).json({ message: 'Order placed successfully' });
    } catch (err) {
      console.error('Error placing order:', err); 
      res.status(400).json({ error: err.message });
    }
  });
  

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('cartItems._id', 'name price quantity image') 
      .sort({ createdAt: -1 }); 

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
