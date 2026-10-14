import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (alertMessage.text) setAlertMessage({ type: '', text: '' });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage({ type: '', text: '' });

    try {
      await API.post('/auth/register', formData);
      setAlertMessage({
        type: 'success',
        text: 'Account created successfully! Redirecting...',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setAlertMessage({
        type: 'error',
        text: err.response?.data?.message || 'Signup failed. Please try again.',
      });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', fontFamily: 'Inter, system-ui, sans-serif', padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '40px', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)', width: '100%', maxWidth: '400px', color: '#fff', boxSizing: 'border-box' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', borderRadius: '16px', marginBottom: '15px', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>
            <span style={{ fontSize: '24px' }}>✨</span>
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>Create Account</h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Start managing your workflow like a pro</p>
        </div>

        {/* Alert Notification Box */}
        {alertMessage.text && (
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: alertMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${alertMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, color: alertMessage.type === 'success' ? '#34d399' : '#f87171', fontSize: '13px', borderRadius: '12px', textAlign: 'center' }}>
            {alertMessage.text}
          </div>
        )}
        
        {/* Signup Form */}
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
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
              placeholder="Create a strong password"
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
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>
        
        {/* Footer Link */}
        <p style={{ marginTop: '22px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
        </p>

      </div>
    </div>
  );
}