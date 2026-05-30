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
const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    // Admin verification gate
    if (user && user.email?.trim().toLowerCase() === process.env.ADMIN_EMAIL) { 
      req.user = user;
      next(); 
    } else {
      res.status(403).json({ error: "Access forbidden. Admins only." });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// 1. SIGNUP ROUTE (Public)
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully!", email: newUser.email });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during signup' });
  }
});





// 2. LOGIN ROUTE (Public)
// routes/userRoutes.js -> Login Route Update
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // 🌟 Added: Send the role back to the client app
    res.json({ 
      token, 
      email: user.email, 
      role: user.role 
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during authentication" });
  }
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