import { useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function Signup() {
  // Form ka data store karne ke liye state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: ''
  });

  const [message, setMessage] = useState('');
const navigate = useNavigate();
  // Jab bhi input mein kuch type ho, ye function chalega
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Form submit hone pe ye function chalega
  const handleSubmit = async (e) => {
    e.preventDefault(); // page reload hone se rokta hai
    setTimeout(() => {
      navigate('/login');
    }, 1500);
    try {
      const response = await API.post('/auth/signup', formData);
      setMessage(response.data.message);
       // "User created successfully"
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <br />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Signup</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
      {message && (
  <p style={{
    textAlign: 'center',
    padding: '12px',
    borderRadius: '8px',
    marginTop: '10px',
    backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
    color: message.includes('successfully') ? '#155724' : '#721c24',
    fontWeight: 500
  }}>
    {message}
  </p>
)}
    </div>
  );
}

export default Signup;