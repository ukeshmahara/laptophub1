import React, { useState } from 'react';

const RegisterPage = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !gender || !address) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      console.log('Attempting to register user:', { name, email, gender, address });
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, gender, address })
      });
      
      console.log('Registration response status:', response.status);
      const data = await response.json();
      console.log('Registration response data:', data);
      
      if (response.ok) {
        setSuccess('Registered successfully! Redirecting to login...');
        setTimeout(() => onNavigate('login'), 1500);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
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
            <div className="auth-title">Register</div>
            <div className="auth-subtitle">Create your account to get started.</div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Name</label>
            <input
              id="register-name"
              type="text"
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">Confirm Password</label>
            <input
              id="register-confirm-password"
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-gender">Gender</label>
            <select
              id="register-gender"
              className="form-input"
              value={gender}
              onChange={e => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-address">Address</label>
            <input
              id="register-address"
              type="text"
              className="form-input"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 10, padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: 10, padding: '10px', backgroundColor: '#e6ffe6', borderRadius: '5px' }}>{success}</div>}
          {loading && <div style={{ color: 'blue', marginBottom: 10, padding: '10px', backgroundColor: '#e6f3ff', borderRadius: '5px' }}>Creating account...</div>}
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
          <div className="auth-switch">
            Already have an account?{' '}
            <a href="#" onClick={() => onNavigate('login')}>Login</a>
          </div>
          <div className="auth-switch" style={{marginTop: 10}}>
            <a href="#" onClick={() => onNavigate('home')}>Back to Home</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 