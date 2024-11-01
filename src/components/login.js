import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    try {
      // Make login request to backend
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Check response
      console.log('Login response:', res.data);
      
      // Store token and userId in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId); // Save userId in localStorage
      
      // Redirect to home page after successful login
      navigate('/home');
      
    } catch (err) {
      // Log error and set an error message
      console.error('Error logging in:', err.response?.data?.msg || err.message);
      setErrorMsg(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input 
          type="email" 
          name="email" 
          value={email} 
          onChange={onChange} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          name="password" 
          value={password} 
          onChange={onChange} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
      </form>
      
      {/* Show error message if login fails */}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  );
};

export default Login;
