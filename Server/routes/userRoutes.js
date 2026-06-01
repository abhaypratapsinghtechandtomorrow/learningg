// routes/userRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// 🔒 ADMIN AUTHENTICATION MIDDLEWARE
// Restricts endpoints to your specific admin profile credentials
// Inside your route files: Extracting from req.cookies
const isAdmin = async (req, res, next) => {
  try {
    // 🚀 Grab the token seamlessly out of parsed request cookies
    const token = req.cookies.token; 

    if (!token) {
      return res.status(401).json({ error: "Access denied. No active session found." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    if (user.role === 'admin') {
      req.user = user; 
      next(); 
    } else {
      res.status(403).json({ error: "Access forbidden. Requires Administrative permissions." });
    }
  } catch (error) {
    res.status(401).json({ error: "Session expired or invalid." });
  }
};

// 1. SIGNUP ROUTE (Public)
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(409).json({ error: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedEmail === process.env.ADMIN_EMAIL?.trim().toLowerCase() ? 'admin' : 'user'
    });
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully!", email: newUser.email });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during signup' });
  }
});









// 2. LOGIN ROUTE (Public)
// routes/userRoutes.js -> Login Route Update
// routes/userRoutes.js -> Login Update
// routes/userRoutes.js -> Login Update
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (adminEmail && normalizedEmail === adminEmail && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    // Generate the token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 🚀 INDUSTRY STANDARD: Send the token inside a secure httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,                 // Prevents client-side JS from reading it (Stops XSS)
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict',             // Prevents Cross-Site Request Forgery (CSRF)
      maxAge: 24 * 60 * 60 * 1000     // 1 day expiration matching the JWT lifespan
    });

    // Send back everything EXCEPT the token in the body response
    res.json({ 
      message: "Login successful",
      email: user.email, 
      role: user.role 
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during authentication" });
  }
});




// routes/userRoutes.js -> Add Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logged out successfully" });
});







// 3. GET ALL USERS ROUTE (🔒 PROTECTED: Admin Only)
router.get('/users', isAdmin, async (req, res) => {
  try {
    // find({}, '-password') returns all user records but hides the hashed passwords for security
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user registry" });
  }
});



// router.get('/users', async (req, res) => {
//   try {
//     // find({}, '-password') returns all user records but hides the hashed passwords for security
//     const users = await User.find({}, '-password').sort({ createdAt: -1 });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve user registry" });
//   }
// });




// 4. DELETE USER ROUTE (🔒 PROTECTED: Admin Only)
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    const userIdToDelete = req.params.id;

    // Optional Safety Guard: Prevent the admin from accidentally deleting themselves
    const userToDrop = await User.findById(userIdToDelete);
    if (userToDrop && userToDrop.email === process.env.ADMIN_EMAIL) {
      return res.status(400).json({ error: "Action denied. The root Admin account cannot be deleted." });
    }

    const deletedUser = await User.findByIdAndDelete(userIdToDelete);
    
    if (!deletedUser) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.json({ message: "User account deleted permanently!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user profile" });
  }
});

export default router;