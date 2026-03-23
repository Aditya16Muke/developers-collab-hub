import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const sClass = { open: 's-open', 'in-progress': 's-progress', completed: 's-done' };
  const sLabel = { open: 'OPEN', 'in-progress': 'ACTIVE', completed: 'DONE' };

  return (
    <div className="card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--white)', lineHeight: '1.3', flex: 1 }}>{project.title}</h3>
        <span className={sClass[project.status]} style={{ flexShrink: 0, fontFamily: 'JetBrains Mono', letterSpacing: '0.5px' }}>
          {sLabel[project.status]}
        </span>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.65', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {project.description}
      </p>

      {project.techStack?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {project.techStack.slice(0, 4).map((t, i) => <span key={i} className="tag-cyan">{t}</span>)}
          {project.techStack.length > 4 && <span style={{ fontSize: '11px', color: 'var(--muted)', padding: '3px 6px' }}>+{project.techStack.length - 4}</span>}
        </div>
      )}

      <div className="hr" style={{ margin: '0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '22px', height: '22px', background: 'var(--cyan)',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#000',
          }}>{project.owner?.name?.charAt(0).toUpperCase()}</div>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>{project.owner?.name}</span>
        </div>
        <Link to={`/projects/${project._id}`} style={{
          color: 'var(--cyan)', textDecoration: 'none', fontSize: '13px',
          fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px',
        }}>View →</Link>
      </div>
    </div>
  );
};

export default ProjectCard;