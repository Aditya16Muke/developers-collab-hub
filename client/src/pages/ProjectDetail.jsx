import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchProject, deleteProject } from '../api/projects';
import { sendJoinRequest, getProjectRequests, respondToRequest } from '../api/joinRequests';

const ProjectDetail = () => {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const [project, setProject]   = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState('');
  const [feedback, setFeedback] = useState('');

  const isOwner       = user && project?.owner?._id === user._id;
  const isCollaborator= project?.collaborators?.some(c => c._id === user?._id);
  const isMember      = isOwner || isCollaborator;

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetchProject(id);
        setProject(r.data);
        if (user && r.data.owner._id === user._id) {
          const rr = await getProjectRequests(id);
          setRequests(rr.data);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [id, user]);

  const handleJoin = async () => {
    try {
      await sendJoinRequest({ projectId: id, message });
      setFeedback('Request sent successfully!');
      setMessage('');
    } catch (e) { setFeedback(e.response?.data?.message || 'Failed to send request'); }
  };

  const handleRespond = async (reqId, status) => {
    try {
      await respondToRequest(reqId, status);
      setRequests(prev => prev.map(r => r._id === reqId ? { ...r, status } : r));
      if (status === 'accepted') { const r = await fetchProject(id); setProject(r.data); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this project?')) return;
    await deleteProject(id);
    navigate('/dashboard');
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '36px', height: '36px', border: '2px solid rgba(245,195,66,0.2)', borderTopColor: '#f5c342', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!project) return <div style={{ textAlign: 'center', padding: '60px', color: '#7878a0' }}>Project not found</div>;

  const statusClass = { open: 'status-open', 'in-progress': 'status-progress', completed: 'status-done' };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: '400px', height: '400px', background: '#7c6ff7', top: '-100px', right: '-100px' }} />

      <div className="section-wrap" style={{ paddingTop: '48px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '760px' }}>

          {/* Main card */}
          <div className="glass-card" style={{ padding: '32px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div>
                <span className={statusClass[project.status]} style={{ fontSize: '11px', padding: '3px 12px', borderRadius: '100px', marginBottom: '12px', display: 'inline-block' }}>
                  {project.status}
                </span>
                <h1 style={{ fontFamily: 'Syne', fontWeight: '800', fontSize: 'clamp(22px,4vw,32px)', letterSpacing: '-0.8px', lineHeight: '1.15' }}>{project.title}</h1>
              </div>
              {isOwner && (
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                  <Link to={`/chat/${project._id}`} className="btn-gold" style={{ textDecoration: 'none', fontSize: '13px', padding: '9px 18px' }}>Team Chat</Link>
                  <button onClick={handleDelete} className="btn-danger">Delete</button>
                </div>
              )}
            </div>

            <p style={{ fontSize: '15px', color: '#b0b0c8', lineHeight: '1.75', marginBottom: '24px' }}>{project.description}</p>

            {project.techStack?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                {project.techStack.map((t, i) => <span key={i} className="tech-pill">{t}</span>)}
              </div>
            )}

            <div className="divider" />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '20px', fontSize: '14px', color: '#7878a0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg,#f5c342,#e8784a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#07070f' }}>
                  {project.owner?.name?.charAt(0).toUpperCase()}
                </div>
                <span>Owner: <span style={{ color: '#eeeef8', fontWeight: '500' }}>{project.owner?.name}</span></span>
              </div>
              <span>Team: <span style={{ color: '#eeeef8', fontWeight: '500' }}>{(project.collaborators?.length || 0) + 1} / {project.maxTeamSize}</span></span>
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noreferrer" style={{ color: '#f5c342', textDecoration: 'none' }}>GitHub →</a>
              )}
            </div>
          </div>

          {/* Collaborators */}
          {project.collaborators?.length > 0 && (
            <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '16px', marginBottom: '16px' }}>Team Members</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {project.collaborators.map(c => (
                  <Link key={c._id} to={`/profile/${c._id}`} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '100px', padding: '6px 14px', transition: 'all 0.2s',
                  }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c6ff7,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#fff' }}>
                      {c.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '13px', color: '#eeeef8', fontWeight: '500' }}>{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Join request */}
          {user && !isOwner && !isMember && project.status === 'open' && (
            <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '16px', marginBottom: '16px' }}>Request to Join</h2>
              {feedback ? (
                <div style={{ background: feedback.includes('success') ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${feedback.includes('success') ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: feedback.includes('success') ? '#4ade80' : '#f87171' }}>
                  {feedback}
                </div>
              ) : (
                <>
                  <textarea className="input-dark" value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell the owner why you want to join and what skills you bring..." rows={3} style={{ resize: 'none', marginBottom: '12px' }} />
                  <button onClick={handleJoin} className="btn-gold">Send Request</button>
                </>
              )}
            </div>
          )}

          {/* Chat button for members */}
          {isMember && !isOwner && (
            <div className="glass-card" style={{ padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderColor: 'rgba(245,195,66,0.2)' }}>
              <div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>You are a collaborator</h3>
                <p style={{ fontSize: '13px', color: '#7878a0' }}>Access the team chat room</p>
              </div>
              <Link to={`/chat/${project._id}`} className="btn-gold" style={{ textDecoration: 'none', fontSize: '13px' }}>Open Chat →</Link>
            </div>
          )}

          {/* Join requests for owner */}
          {isOwner && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '16px', marginBottom: '16px' }}>
                Join Requests <span style={{ color: '#f5c342' }}>({requests.filter(r => r.status === 'pending').length} pending)</span>
              </h2>
              {requests.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#44446a' }}>No requests yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {requests.map(req => (
                    <div key={req._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c6ff7,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: '#fff' }}>
                            {req.applicant?.name?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '600', fontSize: '14px', color: '#eeeef8' }}>{req.applicant?.name}</span>
                          <span className={req.status === 'pending' ? 'status-progress' : req.status === 'accepted' ? 'status-open' : 'status-done'} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px' }}>
                            {req.status}
                          </span>
                        </div>
                        {req.applicant?.skills?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                            {req.applicant.skills.map((s, i) => <span key={i} className="tech-pill" style={{ fontSize: '10px' }}>{s}</span>)}
                          </div>
                        )}
                        {req.message && <p style={{ fontSize: '13px', color: '#7878a0', lineHeight: '1.5' }}>{req.message}</p>}
                      </div>
                      {req.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <button onClick={() => handleRespond(req._id, 'accepted')} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>Accept</button>
                          <button onClick={() => handleRespond(req._id, 'rejected')} className="btn-danger" style={{ padding: '7px 14px', fontSize: '12px' }}>Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;