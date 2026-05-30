// src/main.jsx
//impot main.css here if you have any global styles
import "./main.css"

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import Sidebar from './Component/Sidebar';
import Login from './api/Login';
import Signup from './api/Signup';
import Blogs from './Component/Blogs';
import CreateBlog from './Component/CreateBlog';
import UserManagement from './Component/UserManagement';
import { Navigate } from 'react-router-dom';

// This component wraps around any view that only admins should see
function AdminProtectedRoute({ user, children }) {
  const isAdmin = user?.email?.trim().toLowerCase() === import.meta.env.VITE_ADMIN_EMAIL;

  if (!isAdmin) {
    // If they aren't the admin, silently bounce them back to the homepage
    return <Navigate to="/" replace />;
  }

  // If they are the admin, render the page normally
  return children;
}







// ─────────────────────────────────────
// 1. PAGES
// ─────────────────────────────────────
function Home() {
  return <h1>🏠 Home Page</h1>;
}

function About() {
  return <h1>👤 About Page</h1>;
}

function Contact() {
  return <h1>📬 Contact Page</h1>;
}

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

// ─────────────────────────────────────
// 2. NAVBAR
// ─────────────────────────────────────
// function Navbar({ user, onLogout }) {
//   return (
//     <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#333', color: 'white' }}>
//       <div style={{ display: 'flex', gap: '1rem' }}>
//         <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
//         <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
//         <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
//         <Link to="/blogs" style={{ color: 'white', textDecoration: 'none' }}>Blogs</Link>
//         <Link to="/create-blog" style={{ color: 'white', textDecoration: 'none' }}>Create Blog</Link>
//       </div>
      
//       <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
//         {user ? (
//           <>
//             <span>Welcome, <b>{user.email}</b></span>
//             <button onClick={onLogout} style={{ cursor: 'pointer', padding: '5px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" style={{ color: '#fff' }}>Login</Link>
//             <Link to="/signup" style={{ color: '#fff' }}>Signup</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }




function Navbar({ user, onLogout }) {
  // Hardcode the exact same admin check logic here
  const isAdminUser = user?.email?.trim().toLowerCase() === import.meta.env.VITE_ADMIN_EMAIL;

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#333', color: 'white' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
        <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
        <Link to="/blogs" style={{ color: 'white', textDecoration: 'none' }}>Blogs</Link>
        
        {/* 🌟 FULL CONTROL: This link is invisible to everyone else */}
        {isAdminUser && (
          <Link to="/create-blog" style={{ color: '#2ecc71', fontWeight: 'bold', textDecoration: 'none' }}>✍️ Write Blog</Link>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {user ? (
          <>
            <span>Welcome, <b>{user.email}</b></span>
            <button onClick={onLogout} style={{ padding: '5px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff' }}>Login</Link>
            <Link to="/signup" style={{ color: '#fff' }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}





// ─────────────────────────────────────
// 3. LAYOUT — Navbar + Outlet + Footer
// ─────────────────────────────────────
function Layout({ user, onLogout }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={onLogout} />                   

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar /> 
        
        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet /> 
        </main>
      </div>

      <footer style={{ padding: '1rem', background: '#eee', textAlign: 'center' }}>
        © 2026 My App
      </footer>
    </div>
  );
}

// ─────────────────────────────────────
// 4. APP — Core State and Routing Logic
// ─────────────────────────────────────
function App() {
  const [user, setUser] = useState(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (savedEmail && token) {
      return { email: savedEmail };
    }

    return null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
          {/* FIXED: The broken line has been removed from right here */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login onLogin={handleLogin} />} />
          <Route path="signup" element={<Signup onLogin={handleLogin} />} />
          {/* Inside your Routes list in main.jsx */}
          <Route path="blogs" element={<Blogs />} />
          {/* 🔒 PROTECTED ROUTE: Only renders if user passes the admin check */}
        <Route 
          path="create-blog" 
          element={
            <AdminProtectedRoute user={user}>
              <CreateBlog user={user} />
            </AdminProtectedRoute>
          }
          />
        </Route>




                <Route 
          path="admin/users" 
          element={
            <AdminProtectedRoute user={user}>
              <UserManagement />
            </AdminProtectedRoute>
          } 
        />



        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// ─────────────────────────────────────
// 5. RENDER
// ─────────────────────────────────────
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);