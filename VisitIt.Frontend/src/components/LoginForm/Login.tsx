import React, { useState } from 'react';
import axios from 'axios';
import './LoginStyle.css'

interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await axios.post<LoginResponse>('https://localhost:7001/login', {
                email: email,
                password: password
            });
            alert('Logged in!');

        } catch (err: any) {
        if (err.response && err.response.status === 401) {
            setError('Wrong email or password.');
        } else {
            setError('Error with serverside.');
        }
        } finally {
        setIsLoading(false);
        }
    }

    return (
        <div className="login-container">
            <h2>Welcome!</h2>
            
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    placeholder="example@email.com"
                />
                </div>

                <div className="input-group">
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                    placeholder="••••••••"
                />
                </div>

                <button type="submit" disabled={isLoading} className="login-button">
                {isLoading ? 'Logging in...' : 'Log In!'}
                </button>
            </form>
        </div>
    );
};