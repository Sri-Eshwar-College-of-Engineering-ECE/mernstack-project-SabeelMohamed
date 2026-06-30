const express = require('express');
const router = express.Router();
const Buyer = require('../models/Buyer');


router.post('/register', async (req, res) => {
  const { name, email, password, phoneNumber, location } = req.body;

  try {
    const existingBuyer = await Buyer.findOne({ email });
    if (existingBuyer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newBuyer = new Buyer({ name, email, password, phoneNumber, location });
    await newBuyer.save();
    res.status(201).json({ message: "Buyer registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const buyer = await Buyer.findOne({ email });

    if (!buyer || buyer.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      buyerId: buyer._id,
      buyer: {
        _id: buyer._id,
        name: buyer.name,
        email: buyer.email,
        phoneNumber: buyer.phoneNumber,
        location: buyer.location
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
