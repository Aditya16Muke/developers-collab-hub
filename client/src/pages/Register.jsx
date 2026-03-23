import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/auth';

const Register = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try { const r = await registerUser(form); login(r.data); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: '500px', height: '500px', background: '#f700ff', top: '-200px', right: '-200px' }} />
      <div className="orb" style={{ width: '400px', height: '400px', background: '#00f5d4', bottom: '-100px', left: '-100px' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '18px', letterSpacing: '4px', color: 'var(--cyan)' }}>← DEVCOLLAB</div>
        </Link>

        <div className="mono" style={{ fontSize: '11px', color: '#f700ff', letterSpacing: '2px', marginBottom: '12px' }}>// CREATE ACCOUNT</div>
        <h1 style={{ fontSize: '30px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '6px' }}>Join the network</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '36px' }}>Start collaborating in 30 seconds. Always free.</p>

        {error && (
          <div style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#ff6b6b' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="lbl">Full Name</label>
            <input className="input" type="text" placeholder="Alex Developer" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="lbl">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="lbl">Password</label>
            <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px', fontSize: '15px', opacity: loading ? .7 : 1 }}>
            {loading ? 'Creating...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted)', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;