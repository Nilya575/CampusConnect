import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function EditProfile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await API.put('/auth/update-profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // localStorage mein bhi updated data save karo
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setMessage('Profile updated successfully!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />
        <button type="submit">Save Changes</button>
      </form>

      {message && (
        <p style={{
          textAlign: 'center',
          padding: '12px',
          borderRadius: '8px',
          marginTop: '10px',
          backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
          color: message.includes('successfully') ? '#155724' : '#721c24'
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default EditProfile;