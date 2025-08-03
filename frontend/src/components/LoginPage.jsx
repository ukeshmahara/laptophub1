import React, { useState } from 'react';

const LoginPage = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    
    if (role === 'admin') {
      if (email === 'admin@gmail.com' && password === 'admin@1212') {
        const userData = {
          name: 'Rohit Shrestha',
          email: email,
          isAdmin: true
        };
        if (onLogin) {
          onLogin(userData);
          onNavigate('admin-dashboard');
        } else {
          alert('Logged in as Admin!');
          onNavigate('admin-dashboard');
        }
      } else {
        setError('Invalid admin credentials.');
        setLoading(false);
        return;
      }
    } else {
      try {
        console.log('Attempting to login with:', { email });
        const response = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        console.log('Login response status:', response.status);
        const data = await response.json();
        console.log('Login response data:', data);
        
        if (response.ok && data.data && data.data.token) {
          localStorage.setItem('token', data.data.token);
          console.log('Token stored, fetching user details...');
          
          // Fetch user details after successful login
          try {
            const userResponse = await fetch('http://localhost:4000/api/auth/init', {
              method: 'GET',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.data.token}`
              }
            });
            
            console.log('User details response status:', userResponse.status);
            const userData = await userResponse.json();
            console.log('User details data:', userData);
            
            if (userResponse.ok && userData.data) {
              if (onLogin) {
                onLogin(userData.data);
              }
            } else {
              // Fallback if user details fetch fails
              if (onLogin) {
                onLogin({ email, name: email.split('@')[0] });
              }
            }
          } catch (userErr) {
            console.error('Error fetching user details:', userErr);
            // If user fetch fails, still login with basic info
            if (onLogin) {
              onLogin({ email, name: email.split('@')[0] });
            }
          }
          setLoading(false);
          onNavigate('dashboard');
        } else {
          setError(data.message || 'Login failed. Please check your credentials.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Login error:', err);
        setError('Network error. Please check if the server is running.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image" style={{background: '#94e498'}}>
        {/* You can add an image or illustration here if desired */}
      </div>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-header">
            <div className="auth-title">Login</div>
            <div className="auth-subtitle">Welcome back! Please login to your account.</div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-role">Role</label>
            <select
              id="login-role"
              className="form-input"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 10, padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>{error}</div>}
          {loading && <div style={{ color: 'blue', marginBottom: 10, padding: '10px', backgroundColor: '#e6f3ff', borderRadius: '5px' }}>Logging in...</div>}
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="auth-switch">
            Don't have an account?{' '}
            <a href="#" onClick={() => onNavigate('register')}>Register</a>
          </div>
          <div className="auth-switch" style={{marginTop: 10}}>
            <a href="#" onClick={() => onNavigate('home')}>Back to Home</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 