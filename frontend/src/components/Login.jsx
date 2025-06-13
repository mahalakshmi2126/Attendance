import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [officeId, setOfficeId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', { officeId, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId); // for employee dashboard

      // Redirect based on role
      if (res.data.role === 'superadmin') navigate('/superadmin');
      else if (res.data.role === 'admin') navigate('/admin');
      else if (res.data.role === 'employee') navigate('/employee');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Office ID" onChange={(e) => setOfficeId(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
