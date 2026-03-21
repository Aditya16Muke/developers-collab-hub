import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { id }              = useParams();
  const { user, login }     = useAuth();
  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({ name: '', bio: '', skills: [], github: '', avatar: '' });

  const isOwn = user?._id === id;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setProfile(res.data);
        setForm({ name: res.data.name || '', bio: res.data.bio || '', skills: res.data.skills || [], github: res.data.github || '', avatar: res.data.avatar || '' });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!form.skills.includes(skillInput.trim())) {
        setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setForm({ ...form, skills: form.skills.filter(s => s !== skill) });

  const handleSave = async () => {
    try {
      const res = await api.put('/users/profile', form);
      setProfile(res.data);
      login({ ...user, ...res.data });
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!profile) return <div className="text-center py-20"><h2 className="text-xl font-semibold">User not found</h2></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 text-3xl font-bold">{profile.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            {editing ? (
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            )}
            <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
          </div>
          {isOwn && (
            <button onClick={() => editing ? handleSave() : setEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              {editing ? 'Save' : 'Edit Profile'}
            </button>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Bio</h2>
          {editing ? (
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell others about yourself..." rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          ) : (
            <p className="text-gray-600 text-sm">{profile.bio || 'No bio yet'}</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {(editing ? form.skills : profile.skills)?.map((skill, i) => (
              <span key={i} className="bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                {skill}
                {editing && <button onClick={() => removeSkill(skill)} className="text-indigo-400 hover:text-indigo-600">×</button>}
              </span>
            ))}
            {!editing && !profile.skills?.length && <p className="text-gray-400 text-sm">No skills added yet</p>}
          </div>
          {editing && (
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill}
              placeholder="Type a skill and press Enter"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">GitHub</h2>
          {editing ? (
            <input value={form.github} onChange={e => setForm({ ...form, github: e.target.value })}
              placeholder="https://github.com/yourusername"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : profile.github ? (
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-sm">{profile.github}</a>
          ) : (
            <p className="text-gray-400 text-sm">No GitHub link</p>
          )}
        </div>

        {editing && (
          <button onClick={() => setEditing(false)}
            className="w-full border border-gray-200 text-gray-600 py-2 rounded-lg text-sm mt-2 hover:bg-gray-50 transition">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;