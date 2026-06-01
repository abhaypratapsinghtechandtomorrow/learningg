// routes/blogRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import User from '../models/User.js';

const router = express.Router();

// 🔒 INDUSTRY STANDARD: ADMIN AUTHORIZATION MIDDLEWARE
const isAdmin = async (req, res, next) => {
  try {
    // 🚀 Extract token directly from HTTP-Only cookie jar
    const token = req.cookies.token; 

    if (!token) {
      return res.status(401).json({ error: "Access denied. No active session found." });
    }

    // Verify token validity against your server environment signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Query MongoDB using the payload ID
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    // Check dynamic schema role attribute instead of hardcoded strings
    if (user.role === 'admin') {
      req.user = user; 
      next(); // Passed verification! Moving to the next route controller handler
    } else {
      return res.status(403).json({ error: "Access forbidden. Requires Administrative permissions." });
    }
  } catch (error) {
    return res.status(401).json({ error: "Session expired or invalid token structure." });
  }
};

// ──────────────────────────────────────────────────────────────────
// API ROUTES
// ──────────────────────────────────────────────────────────────────

// 1. GET ALL BLOGS (🌐 Public: Anyone can see content layout)
// Endpoint maps to: GET http://localhost:5000/api/blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Newest content shows up first
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs index registry" });
  }
});

// 2. CREATE NEW BLOG (🔒 PROTECTED: Gated behind the secure cookie middleware)
// Endpoint maps to: POST http://localhost:5000/api/blogs
router.post('/', isAdmin, async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    
    // Build and commit standard schema layout object
    const newBlog = new Blog({ title, content, imageUrl });
    await newBlog.save();
    
    res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
  } catch (error) {
    res.status(400).json({ error: "Failed to construct new blog entry data structure" });
  }
});

export default router;