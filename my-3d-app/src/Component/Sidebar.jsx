import React, { useState } from 'react'; // 1. Import useState
import { NavLink } from 'react-router-dom';

function Sidebar() {
  // 2. Track whether sidebar is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#fff' : '#aaa',
    background: isActive ? '#555' : 'transparent',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    whiteSpace: 'nowrap' // Prevents text from wrapping when collapsing
  });

  return (
    <aside style={{
      // 3. Dynamic width: 180px when open, 60px when collapsed
      width: isExpanded ? '180px' : '60px',
      background: '#444',
      padding: '1rem 0.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      transition: 'width 0.3s ease', // Smooth sliding animation
      overflow: 'hidden'
    }}>
      
      {/* 4. Toggle Button */}
      <button 
        onClick={toggleSidebar}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '1.2rem',
          textAlign: isExpanded ? 'right' : 'center',
          padding: '0 0.5rem 1rem 0.5rem',
          outline: 'none'
        }}
        
      >
        {isExpanded ? '◀' : '▶'}
      </button>

      {/* Menu Title (Hidden when collapsed) */}
      {isExpanded && <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0.5rem' }}>Menu</h4>}

      {/* 5. Navigation Links */}
      <NavLink to="/" style={linkStyle}>
        <span>🏠</span> 
        {isExpanded && <span>Home</span>}
      </NavLink>
      
      <NavLink to="/about" style={linkStyle}>
        <span>👤</span> 
        {isExpanded && <span>About</span>}
      </NavLink>
      
      <NavLink to="/contact" style={linkStyle}>
        <span>📬</span> 
        {isExpanded && <span>Contact</span>}
      </NavLink>
      
      <NavLink to="/blogs" style={linkStyle}>
        <span>📝</span> 
        {isExpanded && <span>Blogs</span>}
      </NavLink>

    </aside>
  );
}

export default Sidebar;