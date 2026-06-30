const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');


router.post('/init', async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'admin@gmail.com' });
    if (!existingAdmin) {
      const admin = new Admin({ username: 'admin@gmail.com', password: 'admin@123' });
      await admin.save();
      res.status(201).json({ message: 'Admin initialized' });
    } else {
      res.status(200).json({ message: 'Admin already exists' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
