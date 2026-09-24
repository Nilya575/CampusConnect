import { useState, useEffect } from 'react';
import API from '../api/axios';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await API.get('/events/my-events', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEvents(response.data);
    } catch (error) {
      console.log('Error fetching my events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading your events...</p>;
  }

  return (
    <div>
      <h2>My Registered Events</h2>

      {events.length === 0 ? (
        <p>You haven't registered for any events yet.</p>
      ) : (
        events.map((event) => (
          <div key={event._id} style={{
            border: '1px solid #ddd',
            margin: '15px auto',
            padding: '20px',
            maxWidth: '500px',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyEvents;