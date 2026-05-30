import React from 'react';
import { NavLink } from 'react-router-dom';
import React, { useState } from 'react'; // 1. Import useState






function Sidebar() {
  // A helper function to change link styles when active
  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#fff' : '#aaa',
    background: isActive ? '#555' : 'transparent',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'block'
  });

  return (
    <aside style={{
      width: '180px',
      background: '#444',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <h4 style={{ color: '#fff', margin: '0 0 1rem 0' }}>Menu</h4>
      <NavLink to="/" style={linkStyle}>🏠 Home</NavLink>
      <NavLink to="/about" style={linkStyle}>👤 About</NavLink>
      <NavLink to="/contact" style={linkStyle}>📬 Contact</NavLink>
    </aside>
  )
}


export default Sidebar