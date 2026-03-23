import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projects';

const CreateProject = () => {
  const navigate      = useNavigate();
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [techInput, setTechInput] = useState('');
  const [form, setForm] = useState({ title: '', description: '', techStack: [], maxTeamSize: 5, githubLink: '' });

  const addTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!form.techStack.includes(techInput.trim())) setForm({ ...form, techStack: [...form.techStack, techInput.trim()] });
      setTechInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return setError('Title and description are required');
    setLoading(true);
    try {
      const r = await createProject(form);
      navigate(`/projects/${r.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: '400px', height: '400px', background: '#f5c342', top: '-100px', right: '-100px' }} />

      <div className="section-wrap" style={{ paddingTop: '48px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '640px' }}>

          <div style={{ marginBottom: '36px' }}>
            <p style={{ fontSize: '13px', color: '#7878a0', fontWeight: '500', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>New</p>
            <h1 style={{ fontFamily: 'Syne', fontWeight: '800', fontSize: 'clamp(26px,4vw,36px)', letterSpacing: '-1px' }}>
              Create a <span className="grad-text">Project</span>
            </h1>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="label-dark">Project Title *</label>
              <input className="input-dark" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Open Source Task Manager" />
            </div>

            <div>
              <label className="label-dark">Description *</label>
              <textarea className="input-dark" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your project and what kind of help you need..." rows={5}
                style={{ resize: 'none' }} />
            </div>

            <div>
              <label className="label-dark">Tech Stack</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {form.techStack.map((t, i) => (
                  <span key={i} className="tech-pill" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {t}
                    <span onClick={() => setForm({ ...form, techStack: form.techStack.filter(x => x !== t) })} style={{ opacity: 0.6, fontSize: '13px' }}>×</span>
                  </span>
                ))}
              </div>
              <input className="input-dark" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={addTech} placeholder="Type tech and press Enter (e.g. React)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="label-dark">Max Team Size</label>
                <input className="input-dark" type="number" min={2} max={20} value={form.maxTeamSize} onChange={e => setForm({ ...form, maxTeamSize: e.target.value })} />
              </div>
              <div>
                <label className="label-dark">GitHub Link</label>
                <input className="input-dark" value={form.githubLink} onChange={e => setForm({ ...form, githubLink: e.target.value })} placeholder="https://github.com/..." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
              <button type="button" onClick={() => navigate(-1)} className="btn-ghost" style={{ flex: 1, padding: '13px' }}>Cancel</button>
              <button type="submit" disabled={loading} className="btn-gold" style={{ flex: 2, padding: '13px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating...' : 'Create Project →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;