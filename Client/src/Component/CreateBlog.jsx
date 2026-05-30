import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();


  


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve token stored in browser memory from login
    const token = localStorage.getItem('token'); 

    const response = await fetch( `${import.meta.env.VITE_API_BASE_URL}/api/blogs`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 🔑 Sends the credential securely to Express
      },
      body: JSON.stringify({ title, content, imageUrl })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Blog posted successfully!");
      navigate('/blogs');
    } else {
      // If someone tries to bypass the UI hackily, the backend throws the error here
      alert(`Error: ${data.error}`); 
    }
  };




  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Write a New Blog</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Blog Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Image URL (e.g., ${import.meta.env.VITE_API_BASE_URL}/uploads/pic.jpg)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
        <textarea placeholder="Write your content here..." rows="8" value={content} onChange={e => setContent(e.target.value)} required />
        <button type="submit" style={{ padding: '10px', background: '#2ecc71', color: '#fff', border: 'none', cursor: 'pointer' }}>Publish Post</button>
      </form>
    </div>
  );
}

export default CreateBlog;