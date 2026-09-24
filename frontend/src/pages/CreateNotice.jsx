import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function CreateNotice() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'normal',
    deadline: '',
    attachmentLink: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await API.post('/notices/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Notice created successfully!');
      
      setTimeout(() => {
        navigate('/notices'); // create hone ke baad notices list pe le jao
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create notice');
    }
  };

  return (
    <div>
      <h2>Create Notice</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
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

        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Academic">Academic</option>
          <option value="Scholarship">Scholarship</option>
          <option value="Placement">Placement</option>
          <option value="Hackathon">Hackathon</option>
          <option value="General">General</option>
        </select>

        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />

        <input
          type="text"
          name="attachmentLink"
          placeholder="Attachment Link (optional)"
          value={formData.attachmentLink}
          onChange={handleChange}
        />

        <button type="submit">Create Notice</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateNotice;