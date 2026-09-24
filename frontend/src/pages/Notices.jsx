import { useState, useEffect } from 'react';
import API from '../api/axios';

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await API.get('/notices');
      setNotices(response.data);
    } catch (error) {
      console.log('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noticeId) => {
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/notices/${noticeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Notice deleted successfully');
      fetchNotices();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete notice');
    }
  };

  // Filter logic
  const filteredNotices = selectedCategory === 'All'
    ? notices
    : notices.filter((notice) => notice.category === selectedCategory);

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading notices...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Notice Board</h2>

      {/* Category Filter Dropdown */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ width: '250px' }}
        >
          <option value="All">All Categories</option>
          <option value="Academic">Academic</option>
          <option value="Scholarship">Scholarship</option>
          <option value="Placement">Placement</option>
          <option value="Hackathon">Hackathon</option>
          <option value="General">General</option>
        </select>
      </div>

      {message && <p style={{ textAlign: 'center', color: '#6c5ce7', fontWeight: 500 }}>{message}</p>}

      {filteredNotices.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No notices in this category.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          maxWidth: '1200px',
          margin: '20px auto'
        }}>
          {filteredNotices.map((notice) => (
            <div key={notice._id} className="card">
              <h3>{notice.title}</h3>
              <p>{notice.description}</p>
              <p><strong>Category:</strong> {notice.category}</p>
              <p>
                <strong>Priority:</strong>{' '}
                <span className={notice.priority === 'urgent' ? 'badge-urgent' : 'badge-normal'}>
                  {notice.priority}
                </span>
              </p>
              <p><strong>Posted by:</strong> {notice.postedBy?.name}</p>

              {user && (user.id === notice.postedBy?._id || user.role === 'admin') && (
                <button onClick={() => handleDelete(notice._id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notices;