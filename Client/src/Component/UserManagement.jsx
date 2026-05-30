import { useState, useEffect } from 'react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. GET ALL USERS FUNCTION
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from login
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 🔑 Passing the credential exactly like Postman
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Cannot connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // 2. DELETE USER FUNCTION
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user permanently?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // Refresh the list immediately by filtering out the deleted user from state
        setUsers(users.filter(user => user._id !== userId));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to complete delete request');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading system users...</p>;
  if (error) return <p style={{ color: 'red' }}>⚠️ {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>👥 Registered System Users (Admin Access)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
        <thead>
          <tr style={{ background: '#eee', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>User ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email Address</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td style={{ padding: '10px', border: '1px solid #ddd', fontFamily: 'monospace' }}>{user._id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <button 
                  onClick={() => handleDelete(user._id)}
                  style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  🗑️ Delete Account
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;