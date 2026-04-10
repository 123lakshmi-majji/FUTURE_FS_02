import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    const success = await register(name, email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/login.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        className="auth-card card"
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '420px',
          margin: 'auto',
        }}
      >
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Create your account
        </h2>
        <form onSubmit={handleSubmit} className="form">
          {error && <div className="empty" style={{ color: '#a20000', textAlign: 'center' }}>{error}</div>}
          <div className="field">
            <label>Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="John Doe"
            />
          </div>
          <div className="field">
            <label>Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="test@example.com"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>
          <div className="field">
            <label>Confirm password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>
            Create Account
          </button>
        </form>
        <p className="muted" style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;