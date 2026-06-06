// src/pages/Login/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

import './LoginStyle.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(username, password);
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.role?.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid username or password';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='right-panel'>
      <div className="form-container">
        <h1 className='title'>VisitIt</h1>
        <p className='subtitle'>Register !</p>        

        <div className="divider">
          <span>Or</span>
        </div>

        <p className='subtitle'>Login !</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className='error-text'>
              {error}
            </div>
          )}
          
          <div className="form-grid">
            <div className='form-group'>
              <label className='label'>Username or Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='form-input'
                placeholder="Your username"
                required
              />
            </div>
            
            <div className='form-group'>
              <label className='label'>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='form-input'
                placeholder="xxxxxxxx"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className='login-button'
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <br/>
          <p className='subtitle'>
            hint:<br/>
            user: admin / password: admin123:<br/>
            user: user / password: user123:<br/>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;