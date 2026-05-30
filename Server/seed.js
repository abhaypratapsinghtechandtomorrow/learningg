// seed.js just fpr adding dummy blogs
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './models/Blog.js';

dotenv.config();

const dummyBlogs = [
  {
    title: "Mastering the MERN Stack in 2026",
    content: "Building full-stack applications requires a tight integration between your frontend and backend. In this post, we break down how to structure clean Express routing architectures using modern ES Modules to keep your codebase scannable and modular.",
    imageUrl: "http://localhost:5000/uploads/blog1.jpg"
  },
  {
    title: "Why You Should Stop Using require() in Node.js",
    content: "Native ECMAScript Modules (ESM) are fully standard in modern development. Transitioning from CommonJS require calls to clean import/export statements improves performance, enables top-level await, and aligns your Node runtime with browser-native JavaScript environments.",
    imageUrl: "http://localhost:5000/uploads/blog2.jpg"
  },
  {
    title: "Designing for Ultrawide Monitors",
    content: "With more developers switching to 34-inch curved monitors for productivity, responsive web design needs to think bigger than just standard desktop breakpoints. Learn how to control max-widths and use flexible CSS Grid layouts to keep your frontend layouts readable on high-resolution displays.",
    imageUrl: "http://localhost:5000/uploads/blog3.jpg"
  },
  {
    title: "Securing Express APIs with Environment Variables",
    content: "Hardcoding database passwords or JWT secrets directly into your version-controlled source files is a recipe for security vulnerabilities. Utilizing dotenv keeps sensitive keys outside your code logic, ensuring smooth environment-specific deployments.",
    imageUrl: "http://localhost:5000/uploads/blog4.jpg"
  },
  {
    title: "Understanding JWT Authentication Flows",
    content: "JSON Web Tokens provide a stateless mechanism for user authentication. By verifying a user's password using bcrypt on login, your API issues a signed token back to the React app, which can securely access guarded routes without querying the database password every single time.",
    imageUrl: "http://localhost:5000/uploads/blog5.jpg"
  },
  {
    title: "A Clean Approach to Image Management in Databases",
    content: "Storing heavy binary image formats directly inside MongoDB collections degrades query speeds and inflates database usage. A production-ready alternative is storing assets locally in static directories or cloud storage buckets while linking light URL string paths inside documents.",
    imageUrl: "http://localhost:5000/uploads/blog6.jpg"
  },
  {
    title: "Optimizing State Management in React Forms",
    content: "Uncontrolled versus controlled inputs can significantly impact form responsiveness. Mastering the hooks workflow and avoiding duplicate variable assignments inside asynchronous event submissions creates predictable states and clean user interfaces.",
    imageUrl: "http://localhost:5000/uploads/blog7.jpg"
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("🌱 Connected to database for seeding...");
    // Clear out existing test blogs so you don't keep duplicating them
    await Blog.deleteMany({});
    // Insert the 7 dummy posts
    await Blog.insertMany(dummyBlogs);
    console.log("🚀 Success! 7 Dummy Blogs successfully inserted into MongoDB Atlas.");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });