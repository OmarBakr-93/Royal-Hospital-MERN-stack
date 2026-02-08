const express = require('express');
const router = express.Router();
const { User } = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @route POST /register
 * @desc Create a new user
 * @access Public
 * @body {name, email, password}
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });
    let token = jwt.sign({email, id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);
    return res.status(201).json({ message: 'User created successfully', user: newUser, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


/**
 * @route POST /login
 * @desc Login a user
 * @access Public
 * @body {email, password}
 */

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'password is incorrect' });
    }
    let token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1w' });
    return res.status(200).json({ message: 'User logged in successfully', token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;