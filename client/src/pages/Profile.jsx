import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { id }          = useParams();
  const { user, login } = useAuth();
  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({ name: '', bio: '', skills: [], github: '', avatar: '' });

  const isOwn = user?._id === id;

  useEffect(() => {
    api.get(`/users/${id}`).then(r => {
      setProfile(r.data);
      setForm({ name: r.data.name || '', bio: r.data.bio || '', skills: r.data.skills || [], github: r.data.github || '', avatar: r.data.avatar || '' });
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!form.skills.includes(skillInput.trim())) setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleSave = async () => {
    try {
      const r = await api.put('/users/profile', form);
      setProfile(r.data); login({ ...user, ...r.data }); setEditing(false);
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '36px', height: '36px', border: '2px solid rgba(245,195,66,0.2)', borderTopColor: '#f5c342', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!profile) return <div style={{ textAlign: 'center', padding: '60px' }}>User not found</div>;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: '400px', height: '400px', background: '#7c6ff7', top: '-100px', left: '-100px' }} />

      <div className="section-wrap" style={{ paddingTop: '48px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '600px' }}>

          {/* Profile card */}
          <div className="glass-card" style={{ padding: '32px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#f5c342,#e8784a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne', fontWeight: '800', fontSize: '26px', color: '#07070f',
              }}>{profile.name?.charAt(0).toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                {editing
                  ? <input className="input-dark" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '18px', marginBottom: '4px' }} />
                  : <h1 style={{ fontFamily: 'Syne', fontWeight: '800', fontSize: '22px', letterSpacing: '-0.5px', marginBottom: '4px' }}>{profile.name}</h1>
                }
                <p style={{ fontSize: '13px', color: '#7878a0' }}>{profile.email}</p>
              </div>
              {isOwn && (
                <button onClick={() => editing ? handleSave() : setEditing(true)} className={editing ? 'btn-gold' : 'btn-ghost'} style={{ padding: '8px 18px', fontSize: '13px' }}>
                  {editing ? 'Save' : 'Edit'}
                </button>
              )}
            </div>

            <div className="divider" />

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="label-dark">Bio</label>
                {editing
                  ? <textarea className="input-dark" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell others about yourself..." rows={3} style={{ resize: 'none' }} />
                  : <p style={{ fontSize: '14px', color: profile.bio ? '#eeeef8' : '#44446a', lineHeight: '1.65' }}>{profile.bio || 'No bio added yet'}</p>
                }
              </div>

              <div>
                <label className="label-dark">Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: editing ? '8px' : '0' }}>
                  {(editing ? form.skills : profile.skills)?.map((s, i) => (
                    <span key={i} className="tech-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {s}
                      {editing && <span onClick={() => setForm({ ...form, skills: form.skills.filter(x => x !== s) })} style={{ cursor: 'pointer', opacity: 0.6 }}>×</span>}
                    </span>
                  ))}
                  {!editing && !profile.skills?.length && <span style={{ fontSize: '13px', color: '#44446a' }}>No skills added</span>}
                </div>
                {editing && <input className="input-dark" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill} placeholder="Type a skill and press Enter" />}
              </div>

              <div>
                <label className="label-dark">GitHub</label>
                {editing
                  ? <input className="input-dark" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/username" />
                  : profile.github
                    ? <a href={profile.github} target="_blank" rel="noreferrer" style={{ fontSize: '14px', color: '#f5c342', textDecoration: 'none' }}>{profile.github}</a>
                    : <p style={{ fontSize: '13px', color: '#44446a' }}>No GitHub link</p>
                }
              </div>
            </div>

            {editing && (
              <button onClick={() => setEditing(false)} className="btn-ghost" style={{ width: '100%', marginTop: '20px', padding: '11px' }}>Cancel</button>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Profile;