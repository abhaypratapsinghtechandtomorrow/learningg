import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from './apiClient';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });









    // Send login request to backend (token is set via httpOnly cookie)
    const response = await fetch(apiUrl('/api/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 🚀 Tell fetch to pass the cookie along behind the scenes
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Backend sets httpOnly cookie; keep minimal info client-side
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userRole', data.role || 'user');

      onLogin({ email: data.email, role: data.role }); // Update App State
      navigate('/'); // Redirect to Home
    } else {
      alert(data.error || "Login Failed");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '200px', gap: '10px' }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;