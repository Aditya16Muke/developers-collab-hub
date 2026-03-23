import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyProjects } from '../api/projects';
import ProjectCard from '../components/ProjectCard';

const Dashboard = () => {
  const { user }                = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchMyProjects().then(r => setProjects(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats = [
    { num: projects.length, label: 'TOTAL', color: 'var(--cyan)' },
    { num: projects.filter(p => p.status === 'open').length, label: 'OPEN', color: 'var(--cyan)' },
    { num: projects.filter(p => p.status === 'in-progress').length, label: 'ACTIVE', color: 'var(--yellow)' },
    { num: projects.filter(p => p.status === 'completed').length, label: 'DONE', color: 'var(--muted)' },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: '500px', height: '500px', background: '#00f5d4', top: '-200px', right: '-200px' }} />

      <div className="wrap" style={{ paddingTop: '52px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--cyan)', letterSpacing: '2px', marginBottom: '8px' }}>// DASHBOARD</div>
            <h1 className="display" style={{ fontSize: 'clamp(36px,5vw,56px)', letterSpacing: '2px', lineHeight: 0.95 }}>
              HEY,<br /><span style={{ color: 'var(--cyan)', textShadow: '0 0 30px rgba(0,245,212,0.35)' }}>{user?.name?.split(' ')[0].toUpperCase()}</span>
            </h1>
          </div>
          <Link to="/create-project" className="btn btn-primary" style={{ fontSize: '14px', padding: '12px 26px' }}>+ New Project</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--border)', marginBottom: '52px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: 'var(--bg2)', padding: '24px', textAlign: 'center' }}>
              <div className="display" style={{ fontSize: '48px', color: s.color, lineHeight: 1, marginBottom: '6px' }}>{s.num}</div>
              <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--white)' }}>Your Projects</h2>
          <Link to="/projects" style={{ fontSize: '13px', color: 'var(--cyan)', textDecoration: 'none', fontFamily: 'JetBrains Mono' }}>browse all →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: '32px', height: '32px', border: '2px solid rgba(0,245,212,0.15)', borderTopColor: 'var(--cyan)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
          </div>
        ) : projects.length === 0 ? (
          <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
            <div className="display" style={{ fontSize: '64px', color: 'var(--cyan)', opacity: .2, marginBottom: '16px' }}>NULL</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No projects yet</h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>Create your first project and find collaborators</p>
            <Link to="/create-project" className="btn btn-primary">Create Project</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '14px' }}>
            {projects.map(p => <ProjectCard key={p._id} project={p} />)}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Dashboard;