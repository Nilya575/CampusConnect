import { useState, useEffect } from 'react';
import API from '../api/axios';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [qrCode, setQrCode] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await API.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.log('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage('Please login first to register');
        return;
      }

      const response = await API.post(
        `/events/${eventId}/register`,
        { teamName: 'My Team' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Registered successfully!');
      setQrCode(response.data.qrCode);
      fetchEvents();

    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');

      await API.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Event deleted successfully');
      fetchEvents();

    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete event');
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading events...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎉 Events</h2>

      {message && <p style={{ textAlign: 'center', color: '#6c5ce7', fontWeight: 500 }}>{message}</p>}

      {qrCode && (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <p><strong>Your QR Code (save this for attendance):</strong></p>
          <img
            src={qrCode}
            alt="Registration QR Code"
            style={{ width: '200px', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
          />
        </div>
      )}

      {events.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No events available.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          maxWidth: '1200px',
          margin: '20px auto'
        }}>
          {events.map((event) => (
            <div key={event._id} className="card">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Seats:</strong> {event.registeredUsers.length} / {event.maxSeats}</p>

              <button onClick={() => handleRegister(event._id)}>Register</button>

              {user && (user.id === event.organizedBy?._id || user.role === 'admin') && (
                <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;