import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetUrl('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>
            Emporium
          </Link>
          <h1>Forgot Password</h1>
          <p>Enter your email to generate a password reset link</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', background: '#fee2e2', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ color: '#166534', background: '#dcfce7', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}
        {resetUrl && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', wordBreak: 'break-all' }}>
            Development reset link: <a href={resetUrl}>{resetUrl}</a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? 'Generating link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
