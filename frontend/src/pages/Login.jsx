import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // login ke baad redirect karne ke liye

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/auth/login', formData);
      
      // Token aur user data ko save karo (browser ki localStorage mein)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setMessage('Login successful!');
      
      // 1 second baad redirect kar do kisi page pe (abhi ke liye simple rakhte hain)
      setTimeout(() => {
        navigate('/dashboard'); // abhi ye page nahi bana, baad mein banayenge
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don't have an account? <Link to="/signup">Signup here</Link>
      </p>
    </div>
  );
}

export default Login;