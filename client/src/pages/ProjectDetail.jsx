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

  const isOwner = user && project?.owner?._id === user._id;
  const isCollaborator = project?.collaborators?.some(c => c._id === user?._id);
  const isMember = isOwner || isCollaborator;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProject(id);
        setProject(res.data);
        if (user && res.data.owner._id === user._id) {
          const reqRes = await getProjectRequests(id);
          setRequests(reqRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const handleJoinRequest = async () => {
    try {
      await sendJoinRequest({ projectId: id, message });
      setFeedback('Join request sent successfully!');
      setMessage('');
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleRespond = async (requestId, status) => {
    try {
      await respondToRequest(requestId, status);
      setRequests(prev =>
        prev.map(r => r._id === requestId ? { ...r, status } : r)
      );
      if (status === 'accepted') {
        const res = await fetchProject(id);
        setProject(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!project) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-semibold text-gray-900">Project not found</h2>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full mb-3 inline-block ${
              project.status === 'open' ? 'bg-green-100 text-green-700' :
              project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {project.status}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Link
                to={`/chat/${project._id}`}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Team Chat
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">{project.description}</p>

        {/* Tech Stack */}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech, i) => (
              <span key={i} className="bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-md">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span>Owner: <span className="text-gray-900 font-medium">{project.owner?.name}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>Team: <span className="text-gray-900 font-medium">{project.collaborators?.length + 1} / {project.maxTeamSize}</span></span>
          </div>
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
              <span>🔗</span>
              <span>GitHub Repository</span>
            </a>
          )}
        </div>
      </div>

      {/* Collaborators */}
      {project.collaborators?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Team Members</h2>
          <div className="flex flex-wrap gap-3">
            {project.collaborators.map(collab => (
              <Link
                key={collab._id}
                to={`/profile/${collab._id}`}
                className="flex items-center gap-2 bg-gray-50 hover:bg-indigo-50 px-3 py-2 rounded-lg transition"
              >
                <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-xs font-semibold">
                    {collab.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-700">{collab.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Join Request Section */}
      {user && !isOwner && !isMember && project.status === 'open' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Request to Join</h2>
          {feedback ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {feedback}
            </div>
          ) : (
            <>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tell the owner why you want to join and what skills you bring..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none mb-3"
              />
              <button
                onClick={handleJoinRequest}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition"
              >
                Send Request
              </button>
            </>
          )}
        </div>
      )}

      {/* Chat button for members */}
      {isMember && !isOwner && (
        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6 mb-6 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">You are a collaborator</h3>
            <p className="text-gray-500 text-sm">Access the team chat room</p>
          </div>
          <Link
            to={`/chat/${project._id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Open Chat
          </Link>
        </div>
      )}

      {/* Join Requests for Owner */}
      {isOwner && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Join Requests ({requests.filter(r => r.status === 'pending').length} pending)
          </h2>
          {requests.length === 0 ? (
            <p className="text-gray-500 text-sm">No requests yet</p>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req._id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 text-xs font-semibold">
                          {req.applicant?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{req.applicant?.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        req.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                        req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    {req.applicant?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {req.applicant.skills.map((s, i) => (
                          <span key={i} className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {req.message && (
                      <p className="text-gray-500 text-xs">{req.message}</p>
                    )}
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleRespond(req._id, 'accepted')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(req._id, 'rejected')}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;