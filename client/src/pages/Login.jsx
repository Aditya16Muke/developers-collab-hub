import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';

const Login = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const r = await loginUser(form); login(r.data); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: '500px', height: '500px', background: '#00f5d4', top: '-200px', left: '-200px' }} />
      <div className="orb" style={{ width: '400px', height: '400px', background: '#f700ff', bottom: '0', right: '-100px' }} />

      {/* Left panel */}
      <div style={{ flex: 1, borderRight: '1px solid rgba(0,245,212,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ textDecoration: 'none', marginBottom: '56px', display: 'inline-block' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '22px', letterSpacing: '4px', color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,245,212,0.4)' }}>DEVCOLLAB</div>
        </Link>
        <div className="display" style={{ fontSize: 'clamp(40px,5vw,64px)', lineHeight: '0.92', letterSpacing: '2px', marginBottom: '24px' }}>
          BUILD<br />GREAT<br /><span style={{ color: 'var(--cyan)' }}>THINGS.</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.75', maxWidth: '340px', marginBottom: '40px' }}>
          Join thousands of developers collaborating on real projects that ship.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {['Post your project idea in minutes', 'Find skilled collaborators worldwide', 'Chat in real-time with your team'].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '6px', height: '6px', background: 'var(--cyan)', borderRadius: '50%', boxShadow: '0 0 8px var(--cyan)', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div className="mono" style={{ fontSize: '11px', color: 'var(--cyan)', letterSpacing: '2px', marginBottom: '12px' }}>// SIGN IN</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '6px' }}>Welcome back</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '36px' }}>Continue building where you left off</p>

          {error && (
            <div style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#ff6b6b' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="lbl">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="lbl">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px', fontSize: '15px', opacity: loading ? .7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted)', marginTop: '24px' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: '600' }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;