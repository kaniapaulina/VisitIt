
import './LoginPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
    // Login state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Register state
    const [regUsername, setRegUsername] = useState('');
    const [email, setEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const switchTab = (tab: 'login' | 'register') => {
        setActiveTab(tab);
        setError('');
    }

      // LOGIN
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            navigate(userData.role?.toLowerCase() === 'admin' ? '/admin' : '/dashboard');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Invalid username or password';
            setError(errorMessage);
            return;
        } finally {
            setIsLoading(false);
        }
    };

     // REGISTER
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (regPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (!/\d/.test(regPassword)) {
            setError('Password must contain at least one number');
            return;
        }
        if (regPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        console.log('Wysyłam rejestrację:', {
            username: regUsername,
            email: email,
            password: regPassword
        });

        setIsLoading(true);
        try {
            await register(regUsername, email, regPassword);
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Błąd rejestracji:', err);
            console.error('Response:', err.response);
            console.error('Status:', err.response?.status);
            console.error('Data:', err.response?.data);
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <main>
            <div className="login-container">
                <div className='one'>
                    <img src="/assets/pixelforest.jpg" alt="Forest Welcome Graphic" />
                </div>
                
                <div className='two'>
                    <div className='right-panel'>
                        <h1 className='title'>VisitIt</h1>
                        <div className="form-container">

                            <div className="tabs">
                            <button
                                className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                                onClick={() => switchTab('login')}
                            >
                                <p className='subtitle'>Sign in</p>
                            </button>
                            <button
                                className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                                onClick={() => switchTab('register')}
                            >
                                <p className='subtitle'>Register</p>  
                            </button>
                            </div>

                            <div className="tab-slider">
                            <div className={`slider ${activeTab === 'register' ? 'right' : ''}`} />
                            </div>
      


                            {activeTab === 'login' && (
                                <form onSubmit={handleLogin} className="auth-form">
                                {error && (
                                    <div className='error-text'>
                                    {error}
                                    </div>
                                )}
                                
                                <div className="form-grid">
                                    <div className='form-group'>
                                    <label className='label'>Username</label>
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
                                        placeholder="Your password"
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

                                <div className="divider">
                                </div>

                                <p className='subtitle'>
                                    <span>
                                        hint 1: admin | admin123
                                    </span>
                                    <span>
                                        hint 2: user | user123
                                    </span>
                                </p>

                                </form>
                            )}

                            {activeTab === 'register' && (
                                <form onSubmit={handleRegister} className="auth-form">
                                    {error && <div className="error-text">{error}</div>}
                                    
                                    <div className="form-grid">
                                        <div className="form-group full-width">
                                            <label className="label">Username</label>
                                            <input
                                            type="text"
                                            value={regUsername}
                                            onChange={(e) => setRegUsername(e.target.value)}
                                            className="form-input"
                                            placeholder="Choose a username"
                                            required
                                            />
                                        </div>

                                        <div className="form-group full-width">
                                            <label className="label">Email</label>
                                            <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-input"
                                            placeholder="your@email.com"
                                            required
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="label">Password</label>
                                            <input
                                            type="password"
                                            value={regPassword}
                                            onChange={(e) => setRegPassword(e.target.value)}
                                            className="form-input"
                                            placeholder="Min. 6 chars, 1 number"
                                            required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="label">Confirm Password</label>
                                            <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="form-input"
                                            placeholder="Repeat password"
                                            required
                                            />
                                        </div>

                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isLoading} 
                                        className='login-button'>
                                    {isLoading ? 'Creating account...' : 'Create Account'}
                                    </button>

                                    <br/>

                                    <div className="divider"></div>

                                    <div className="subtitle full-width">
                                        <span className={regPassword.length >= 6 ? 'valid' : ''}>
                                        {regPassword.length >= 6 ? '✔' : '✘'} 6+ characters
                                        </span>
                                        <span className={/\d/.test(regPassword) ? 'valid' : ''}>
                                        {/\d/.test(regPassword) ? '✔' : '✘'} 1+ number
                                        </span>
                                        <span className={regPassword && regPassword === confirmPassword ? 'valid' : ''}>
                                        {regPassword && regPassword === confirmPassword ? '✔' : '✘'} Passwords match
                                        </span>
                                    </div>
                                    
                                </form>
                                )}
                                
                            </div>
                    </div>
                </div>
            </div>
        </main>
        
    );
}

export default LoginPage;
