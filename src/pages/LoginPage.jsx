import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../data/firebaseConfig';
import logo from '../assets/full_logo.png';

import './Auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Vote Voyage Logo" className="logo" />
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
