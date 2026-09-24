import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentNotices();
  }, []);

  const fetchRecentNotices = async () => {
    try {
      const response = await API.get('/notices');
      // Sirf top 3 notices lo (already backend se newest-first sorted hain)
      setNotices(response.data.slice(0, 3));
    } catch (error) {
      console.log('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '0 20px' }}>
      <h2>Dashboard</h2>

      {user ? (
        <div className="card" style={{ marginBottom: '20px' }}>
          <p>Welcome, <strong>{user.name}</strong>! 👋</p>
          <p>Role: {user.role}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>No user data found. Please login again.</p>
      )}

      <Link to="/edit-profile">
  <button style={{ marginBottom: '30px' }}>Edit Profile</button>
</Link>

      {/* Recent Notices Section */}
      <h3>📋 Recent Notices</h3>

      {loading ? (
        <p>Loading...</p>
      ) : notices.length === 0 ? (
        <p>No notices available right now.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {notices.map((notice) => (
            <div key={notice._id} className="card">
              <h4 style={{ marginBottom: '6px' }}>{notice.title}</h4>
              <p style={{ fontSize: '14px', color: '#555' }}>
                {notice.description.length > 80
                  ? notice.description.slice(0, 80) + '...'
                  : notice.description}
              </p>
              <span className={notice.priority === 'urgent' ? 'badge-urgent' : 'badge-normal'}>
                {notice.category}
              </span>
            </div>
          ))}
        </div>
      )}

      <Link to="/notices">
        <button style={{ marginTop: '20px' }}>View All Notices</button>
      </Link>
    </div>
  );
}

export default Dashboard;