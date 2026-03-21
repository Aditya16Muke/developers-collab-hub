import { Link } from 'react-router-dom';

const statusColors = {
  open:          'bg-green-100 text-green-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  completed:     'bg-gray-100 text-gray-600',
};

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{project.title}</h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>

      {project.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 4).map((tech, i) => (
            <span key={i} className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-md">
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-gray-400 text-xs py-1">+{project.techStack.length - 4} more</span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 text-xs font-semibold">
              {project.owner?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-gray-500 text-xs">{project.owner?.name}</span>
        </div>
        <Link to={`/projects/${project._id}`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition">
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;