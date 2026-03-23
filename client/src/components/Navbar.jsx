import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav style={{
      background: 'rgba(5,5,8,0.85)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(0,245,212,0.08)',
      position: 'sticky', top: 0, zIndex: 200,
    }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>

        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', background: 'var(--cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Bebas Neue', fontSize: '14px', color: '#000',
            letterSpacing: '1px', borderRadius: '6px',
            boxShadow: '0 0 20px rgba(0,245,212,0.4)',
          }}>DC</div>
          <span style={{ fontFamily: 'Bebas Neue', fontSize: '20px', letterSpacing: '3px', color: 'var(--white)' }}>DEVCOLLAB</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {[{ to: '/projects', label: 'Projects' }, ...(user ? [{ to: '/dashboard', label: 'Dashboard' }] : [])].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: '7px 16px', borderRadius: '6px', textDecoration: 'none',
              fontSize: '13px', fontWeight: '500', letterSpacing: '0.3px',
              color: pathname === to ? 'var(--cyan)' : 'var(--muted)',
              background: pathname === to ? 'rgba(0,245,212,0.06)' : 'transparent',
              border: pathname === to ? '1px solid rgba(0,245,212,0.12)' : '1px solid transparent',
              transition: 'all .2s',
            }}>{label}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <>
              <Link to={`/profile/${user._id}`} style={{
                display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
                padding: '6px 12px', borderRadius: '6px',
                border: '1px solid rgba(0,245,212,0.12)',
                background: 'rgba(0,245,212,0.04)',
                transition: 'all .2s',
              }}>
                <div style={{
                  width: '24px', height: '24px', background: 'var(--cyan)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#000',
                }}>{user.name?.charAt(0).toUpperCase()}</div>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--white)' }}>{user.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={logout} className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: '12px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--muted)', textDecoration: 'none', padding: '7px 14px' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;