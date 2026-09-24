import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    maxSeats: '',
    isTeamEvent: false
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await API.post('/events/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Event created successfully!');

      setTimeout(() => {
        navigate('/events');
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="venue"
          placeholder="Venue"
          value={formData.venue}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="maxSeats"
          placeholder="Max Seats"
          value={formData.maxSeats}
          onChange={handleChange}
          required
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name="isTeamEvent"
            checked={formData.isTeamEvent}
            onChange={handleChange}
          />
          Is this a team event? (e.g., Hackathon)
        </label>

        <button type="submit">Create Event</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateEvent;