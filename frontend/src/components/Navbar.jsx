import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '18px 40px',
  background: 'linear-gradient(135deg, #2d2d44, #1a1a2e)',
  color: 'white',
  boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
}}>
  <h3 style={{ margin: 0, letterSpacing: '1px' }}>🎓 CampusConnect</h3>

  <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/notices" style={{ color: 'white', textDecoration: 'none' }}>Notices</Link>
        <Link to="/events" style={{ color: 'white', textDecoration: 'none' }}>Events</Link>

        {user ? (
  <>
    <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
    <Link to="/my-events" style={{ color: 'white', textDecoration: 'none' }}>My Events</Link>
    {(user.role === 'admin' || user.role === 'teacher') && (
  <>
    <Link to="/create-notice" style={{ color: 'white', textDecoration: 'none' }}>Create Notice</Link>
    <Link to="/create-event" style={{ color: 'white', textDecoration: 'none' }}>Create Event</Link>
    <Link to="/scan-attendance" style={{ color: 'white', textDecoration: 'none' }}>Scan Attendance</Link>
  </>
)}
    
    <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
  </>
) : (
  <>
    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
    <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Signup</Link>
  </>
)}
      </div>
    </nav>
  );
}

export default Navbar;