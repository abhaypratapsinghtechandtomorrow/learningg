import { useState, useEffect } from 'react';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your backend API
    fetch( `${import.meta.env.VITE_API_BASE_URL}/api/blogs`)
      .then(response => response.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Latest Blogs</h2>
      <div style={{ display: 'grid', gap: '20px' }}>
        {blogs.map(blog => (
          <div key={blog._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            {/* Render the image pointing to the backend static URL */}
            <img 
              src={blog.imageUrl} 
              alt={blog.title} 
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '5px' }} 
            />
            <h3 style={{ marginTop: '10px' }}>{blog.title}</h3>
            <p style={{ color: '#555', lineHeight: '1.6' }}>{blog.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;