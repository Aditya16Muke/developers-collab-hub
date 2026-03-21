import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projects';

const CreateProject = () => {
  const navigate      = useNavigate();
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [techInput, setTechInput] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', techStack: [],
    maxTeamSize: 5, githubLink: '', tags: [],
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!form.techStack.includes(techInput.trim())) {
        setForm({ ...form, techStack: [...form.techStack, techInput.trim()] });
      }
      setTechInput('');
    }
  };

  const removeTech = (tech) => setForm({ ...form, techStack: form.techStack.filter(t => t !== tech) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return setError('Title and description are required');
    setLoading(true);
    try {
      const res = await createProject(form);
      navigate(`/projects/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create a Project</h1>
        <p className="text-gray-500 mt-1">Share your idea and find collaborators</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
          <input name="title" value={form.title} onChange={handleChange}
            placeholder="e.g. Open Source Task Manager"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Describe your project and what kind of help you need..."
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.techStack.map((tech, i) => (
              <span key={i} className="bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                {tech}
                <button type="button" onClick={() => removeTech(tech)} className="text-indigo-400 hover:text-indigo-600">×</button>
              </span>
            ))}
          </div>
          <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={addTech}
            placeholder="Type a technology and press Enter"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Team Size</label>
          <input type="number" name="maxTeamSize" value={form.maxTeamSize} onChange={handleChange}
            min={2} max={20}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Link (optional)</label>
          <input name="githubLink" value={form.githubLink} onChange={handleChange}
            placeholder="https://github.com/username/repo"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)}
            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2.5 rounded-xl font-medium text-sm transition">
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;