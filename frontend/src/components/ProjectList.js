import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          api.get('/projects'),
          api.get('/users'),
        ]);
        setProjects(projectsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError('Failed to fetch projects or users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getUsersByIds = (ids) => {
    return users.filter(user => ids.includes(user.id));
  };

  const getUsersByRole = (usersList, role) => {
    return usersList.filter(user => user.role === role);
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Link 
          to="/projects/new" 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Create New Project
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          console.log('Project data:', project);
          const assignedUsers = project.assignedUsers || [];
          const assignedDevelopers = getUsersByRole(assignedUsers, 'Developer');
          const assignedManagers = getUsersByRole(assignedUsers, 'Manager');

          return (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                <Link to={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                  {project.name} (ID: {project.id})
                </Link>
              </h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Status: {project.status}</span>
                <span>Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="mb-4">
                {/* Removed assigned developers and managers display as per user request */}
              </div>
              <div className="mb-4">
                {/* Removed assigned developers and managers display as per user request */}
              </div>
              <div className="flex space-x-4">
                <Link
                  to={`/projects/${project.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      try {
                        await api.delete(`/projects/${project.id}`);
                        setProjects((prev) => prev.filter((p) => p.id !== project.id));
                      } catch (error) {
                        alert('Failed to delete project');
                        console.error(error);
                      }
                    }
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectList;
