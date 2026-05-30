import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routers
import blogRoutes from './routes/blogRoutes.js';
import userRoutes from './routes/userRoutes.js'; // 🚀 Added

dotenv.config();

const app = express();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors()); 

// Serve static images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("=========================================");
    console.log("🚀 MongoDB Connection Established Successfully!");
    console.log("=========================================");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed!", err.message);
  });

// Base Test Route
app.get('/', (req, res) => {
  res.send('Server is running smoothly!');
});

// LINK ROUTERS HERE
app.use('/api/blogs', blogRoutes);
app.use('/api', userRoutes); // 🚀 This handles both /api/signup and /api/login

// Start Server
app.listen(PORT, () => {
  console.log(`📡 Server running on port ${PORT}`);
});