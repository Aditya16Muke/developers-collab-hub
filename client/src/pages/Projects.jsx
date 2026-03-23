import { useState, useEffect } from 'react';
import { fetchProjects } from '../api/projects';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [tech, setTech]         = useState('');

  const load = async () => {
    setLoading(true);
    try { const r = await fetchProjects({ search, status, tech }); setProjects(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: '500px', height: '500px', background: '#7c6ff7', top: '-100px', left: '-200px' }} />

      <div className="section-wrap" style={{ paddingTop: '48px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontSize: '13px', color: '#7878a0', fontWeight: '500', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Discover</p>
          <h1 style={{ fontFamily: 'Syne', fontWeight: '800', fontSize: 'clamp(26px,4vw,38px)', letterSpacing: '-1px' }}>
            Browse <span className="grad-text">Projects</span>
          </h1>
        </div>

        {/* Filters */}
        <form onSubmit={e => { e.preventDefault(); load(); }} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' }}>
          <input className="input-dark" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 2, minWidth: '200px' }} />
          <input className="input-dark" placeholder="Filter by tech..." value={tech} onChange={e => setTech(e.target.value)} style={{ flex: 1, minWidth: '150px' }} />
          <select className="input-dark" value={status} onChange={e => setStatus(e.target.value)} style={{ flex: 1, minWidth: '130px' }}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit" className="btn-gold" style={{ padding: '11px 24px', whiteSpace: 'nowrap' }}>Search</button>
        </form>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: '36px', height: '36px', border: '2px solid rgba(245,195,66,0.2)', borderTopColor: '#f5c342', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>No projects found</h3>
            <p style={{ color: '#7878a0', fontSize: '14px' }}>Try different search terms</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '13px', color: '#7878a0', marginBottom: '20px' }}>{projects.length} projects found</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
              {projects.map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Projects;