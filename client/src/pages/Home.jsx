import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PROJECTS = [
  { title: 'AI Code Reviewer', tech: ['Python', 'GPT-4'], team: '2/5', hot: true },
  { title: 'P2P File Share', tech: ['WebRTC', 'Node'], team: '1/4', hot: false },
  { title: 'Dev Portfolio Gen', tech: ['React', 'Three.js'], team: '3/6', hot: true },
  { title: 'CLI Task Manager', tech: ['Rust', 'SQLite'], team: '2/3', hot: false },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ position: 'relative' }}>
      <div className="orb" style={{ width: '800px', height: '800px', background: '#00f5d4', top: '-300px', left: '-300px' }} />
      <div className="orb" style={{ width: '600px', height: '600px', background: '#f700ff', top: '100px', right: '-200px' }} />
      <div className="orb" style={{ width: '500px', height: '500px', background: '#00f5d4', bottom: '0', right: '20%' }} />

      {/* ── HERO ── */}
      <section className="grid-bg scanline" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="wrap" style={{ width: '100%', paddingTop: '80px', paddingBottom: '80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

          {/* Left */}
          <div>
            <div className="fu" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,245,212,0.06)', border: '1px solid rgba(0,245,212,0.15)', borderRadius: '4px', padding: '6px 14px', marginBottom: '32px' }}>
              <div style={{ width: '7px', height: '7px', background: 'var(--cyan)', borderRadius: '50%', animation: 'glow-pulse 2s ease infinite' }} />
              <span className="mono" style={{ fontSize: '11px', color: 'var(--cyan)', letterSpacing: '1px' }}>SYSTEM ONLINE — 247 DEVS ACTIVE</span>
            </div>

            <h1 className="fu1 display" style={{
              fontSize: 'clamp(64px,9vw,110px)',
              lineHeight: '0.92', letterSpacing: '3px',
              marginBottom: '28px', color: 'var(--white)',
            }}>
              BUILD<br />
              <span style={{ color: 'var(--cyan)', textShadow: '0 0 40px rgba(0,245,212,0.4)' }}>COLLAB</span><br />
              SHIP.
            </h1>

            <p className="fu2" style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: '1.8', maxWidth: '420px', marginBottom: '40px' }}>
              The platform where developers post ideas, recruit teammates, and build real software — together.
            </p>

            <div className="fu3" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '56px' }}>
              <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }}>
                {user ? 'Dashboard →' : 'Start Building →'}
              </Link>
              <Link to="/projects" className="btn btn-outline" style={{ fontSize: '15px', padding: '14px 32px' }}>
                Browse Projects
              </Link>
            </div>

            <div className="fu4" style={{ display: 'flex', gap: '40px' }}>
              {[['500+', 'Developers'], ['120+', 'Projects'], ['80+', 'Teams']].map(([n, l]) => (
                <div key={l}>
                  <div className="display" style={{ fontSize: '36px', color: 'var(--white)', lineHeight: 1 }}>{n}</div>
                  <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', letterSpacing: '1px' }}>{l.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — live project cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', letterSpacing: '1px' }}>// LIVE PROJECTS</div>
            {PROJECTS.map((p, i) => (
              <div key={i} className="card" style={{
                padding: '16px 20px',
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                borderColor: p.hot ? 'rgba(247,0,255,0.2)' : 'rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--white)' }}>{p.title}</span>
                  {p.hot && <span style={{ fontSize: '10px', color: '#f700ff', border: '1px solid rgba(247,0,255,0.3)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'JetBrains Mono' }}>HOT</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {p.tech.map((t, j) => <span key={j} className="tag-cyan">{t}</span>)}
                  </div>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>{p.team} devs</span>
                </div>
              </div>
            ))}
            {/* Terminal cursor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className="mono" style={{ fontSize: '13px', color: 'var(--cyan)' }}>$ </span>
              <span className="mono" style={{ fontSize: '13px', color: 'var(--muted)' }}>find --open-projects</span>
              <div style={{ width: '9px', height: '16px', background: 'var(--cyan)', animation: 'blink 1.1s step-end infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 24px', background: 'var(--bg2)' }}>
        <div className="wrap">
          <div style={{ marginBottom: '60px' }}>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--cyan)', letterSpacing: '2px', marginBottom: '12px' }}>// FEATURES</div>
            <h2 className="display" style={{ fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '2px', lineHeight: 0.95 }}>
              EVERYTHING<br />
              <span style={{ color: 'var(--cyan)' }}>YOU NEED</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { num: '01', title: 'Post Projects', desc: 'Share your vision with tech stack, team size, and goals. Attract exactly who you need.', accent: 'var(--cyan)' },
              { num: '02', title: 'Smart Requests', desc: 'Applicants send messages with context. You see their skills. Accept or reject instantly.', accent: '#f700ff' },
              { num: '03', title: 'Real-time Chat', desc: 'WebSocket-powered team chat. Messages persist. Your whole team in one room.', accent: 'var(--yellow)' },
              { num: '04', title: 'Dev Profiles', desc: 'Showcase skills, GitHub, and bio. Let your work attract the right collaborators.', accent: 'var(--cyan)' },
              { num: '05', title: 'Project Tracking', desc: 'Mark projects as open, in-progress, or completed. Always know where you stand.', accent: '#f700ff' },
              { num: '06', title: 'Secure by Default', desc: 'JWT auth, bcrypt hashing, rate limiting, CORS protection. Built production-ready.', accent: 'var(--yellow)' },
            ].map((f, i) => (
              <div key={i} style={{ background: 'var(--bg2)', padding: '32px', transition: 'background .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
              >
                <div className="display" style={{ fontSize: '48px', color: f.accent, opacity: 0.3, lineHeight: 1, marginBottom: '16px' }}>{f.num}</div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px', color: 'var(--white)' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.7' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="display" style={{ fontSize: 'clamp(48px,8vw,96px)', lineHeight: '0.9', letterSpacing: '3px', marginBottom: '28px' }}>
            READY TO<br />
            <span style={{ color: 'var(--cyan)', textShadow: '0 0 60px rgba(0,245,212,0.4)' }}>SHIP?</span>
          </div>
          <p style={{ fontSize: '16px', color: 'var(--muted)', marginBottom: '40px', lineHeight: '1.7' }}>
            Join developers who are building real things together. Free forever.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: '15px', padding: '14px 36px' }}>Create Account →</Link>
            <Link to="/projects" className="btn btn-outline" style={{ fontSize: '15px', padding: '14px 36px' }}>View Projects</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;