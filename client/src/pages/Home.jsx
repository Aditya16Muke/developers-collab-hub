import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🚀</span>
            <span>Build together, grow together</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Find Developers to{' '}
            <span className="text-indigo-600">Collaborate</span>{' '}
            on Your Next Project
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Post your project idea, find skilled developers, and build something amazing together.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {user ? (
              <>
                <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition">
                  Go to Dashboard
                </Link>
                <Link to="/projects" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-3 rounded-xl font-semibold transition">
                  Browse Projects
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition">
                  Get Started Free
                </Link>
                <Link to="/projects" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-3 rounded-xl font-semibold transition">
                  Browse Projects
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to collaborate
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '💡', title: 'Post Project Ideas',    desc: 'Share your project idea and attract talented collaborators.' },
              { icon: '🤝', title: 'Find Collaborators',    desc: 'Browse projects and request to join teams that match your skills.' },
              { icon: '💬', title: 'Real-time Chat',        desc: 'Communicate with your team instantly using built-in chat.' },
              { icon: '👤', title: 'Developer Profiles',    desc: 'Showcase your skills to attract the right collaborators.' },
              { icon: '📊', title: 'Track Progress',        desc: 'Keep projects organized with status tracking.' },
              { icon: '🔒', title: 'Secure Platform',       desc: 'Protected with JWT authentication and encrypted passwords.' },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start building?</h2>
          <p className="text-indigo-100 mb-8 text-lg">Join developers already collaborating on DevCollab.</p>
          <Link to="/register" className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-xl font-semibold transition inline-block">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;