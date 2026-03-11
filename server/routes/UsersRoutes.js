const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/**
 * Route to register a new user
 * @route POST /register
 * @access Public
 * @description Registers a new user 
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    if(!name || !email || !password){
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    })
    let token = jwt.sign({ id: newUser._id, role: newUser.role } , process.env.JWT_SECRET, { expiresIn: "1w" });;
    return res.status(201).json({ message: "User registered successfully", token, user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * Route to Signin a new user
 * @route POST /Signin
 * @access Public
 * @description Signin a user 
 */

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    let token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1w" });;
    return res.status(200).json({ message: "User signed in successfully", token, user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;