// // routes/blogRoutes.js anyone can add blogs to the database using this route, but we will remove the post route later when we have a proper admin panel for adding blogs. For now, it's just a placeholder to test data insertion into the database.
// import express from 'express';
// import Blog from '../models/Blog.js';

// const router = express.Router();

// // GET all blogs
// router.get('/', async (req, res) => {
//   try {
//     const blogs = await Blog.find().sort({ createdAt: -1 }); // Newest blogs first
//     res.json(blogs);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch blogs" });
//   }
// });

// // POST a new blog (Placeholder route for testing data insertion)
// router.post('/', async (req, res) => {
//   try {
//     const { title, content, imageUrl } = req.body;
//     const newBlog = new Blog({ title, content, imageUrl });
//     await newBlog.save();
//     res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
//   } catch (error) {
//     res.status(400).json({ error: "Failed to create blog" });
//   }
// });

// export default router;













// only admin can add blogs to the database using this route, but we will remove the post route later when we have a proper admin panel for adding blogs. For now, it's just a placeholder to test data insertion into the database.


// routes/blogRoutes.js
// import express from 'express';
// import jwt from 'jsonwebtoken';
// import Blog from '../models/Blog.js';
// import User from '../models/User.js';
// import dotenv from 'dotenv';
// dotenv.config();

// const router = express.Router();

// // 🔒 ADMIN AUTHENTICATION MIDDLEWARE
// const isAdmin = async (req, res, next) => {
//   try {
//     // 1. Grab token from headers
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ error: "Access denied. No token provided." });
//     }

//     const token = authHeader.split(' ')[1];

//     // 2. Verify token validity
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // 3. Find user in DB and verify if they are the admin
//     const user = await User.findById(decoded.userId);
    
//     // CRITICAL CONTROL: Hardcode your admin email designation here
//     if (user && user.email ===process.env.ADMIN_EMAIL) { 
//       req.user = user;
//       next(); // User is Admin! Proceed to the route handler
//     } else {
//       res.status(403).json({ error: "Access forbidden. Admins only." });
//     }
//   } catch (error) {
//     res.status(401).json({ error: "Invalid or expired token." });
//   }
// };

// // GET all blogs (Publicly accessible to everyone)
// router.get('/', async (req, res) => {
//   try {
//     const blogs = await Blog.find().sort({ createdAt: -1 });
//     res.json(blogs);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch blogs" });
//   }
// });

// // POST a new blog (🔒 PROTECTED: Passing isAdmin middleware here)
// router.post('/', isAdmin, async (req, res) => {
//   try {
//     const { title, content, imageUrl } = req.body;
//     const newBlog = new Blog({ title, content, imageUrl });
//     await newBlog.save();
//     res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
//   } catch (error) {
//     res.status(400).json({ error: "Failed to create blog" });
//   }
// });

// export default router;














//industry satanerd


// Inside your routes files: Replacing the old isAdmin middleware
const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user from the database using the ID packed inside the token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    // 🌟 INDUSTRY STANDARD: Validate the dynamic database role attribute
    if (user.role === 'admin') {
      req.user = user; // Pass user data to the next function route
      next(); 
    } else {
      res.status(403).json({ error: "Access forbidden. Requires Administrative permissions." });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired session token." });
  }
};