import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const { data } = await API.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Invalid username or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', fontFamily: 'Inter, system-ui, sans-serif', padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '40px', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)', width: '100%', maxWidth: '400px', color: '#fff', boxSizing: 'border-box' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', borderRadius: '16px', marginBottom: '15px', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>
            <span style={{ fontSize: '24px' }}>🚀</span>
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>Welcome Back</h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Enter your credentials to access your workspace</p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '13px', borderRadius: '12px', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', marginTop: '5px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '15px', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.4)' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        {/* Footer Link */}
        <p style={{ marginTop: '22px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>Create account</Link>
        </p>

      </div>
    </div>
  );
}