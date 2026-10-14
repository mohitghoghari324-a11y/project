import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { username, password });
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', fontFamily: 'Inter, system-ui, sans-serif', padding: '20px' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '45px 40px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', width: '100%', maxWidth: '420px', color: '#fff' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ display: 'inline-block', padding: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', borderRadius: '16px', marginBottom: '15px', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>
            <span style={{ fontSize: '24px' }}>✨</span>
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Create Account</h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '15px' }}>Start managing your workflow like a pro</p>
        </div>
        
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</label>
            <input type="text" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '15px', transition: 'all 0.2s' }} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '15px', transition: 'all 0.2s' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '16px', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.4)', transition: 'transform 0.1s' }}>Get Started</button>
        </form>
        
        <p style={{ marginTop: '25px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}