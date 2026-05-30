// src/api/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CHANGED: Endpoint switched from /api/login to /api/signup
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      localStorage.setItem('userEmail', data.email);
      
      onLogin({ email: data.email }); 
      navigate('/');                 
    } else {
      alert(data.error || "Signup Failed");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '200px', gap: '10px' }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;