import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProjectSelect = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSelect = (projectId) => {
    navigate(`/generate-user-story/${projectId}`);
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (projects.length === 0) return <div>No projects found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Select a Project to Generate User Stories</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="mb-3">
            <button
              onClick={() => handleSelect(project.id)}
              className="w-full text-left px-4 py-2 border rounded hover:bg-gray-100"
            >
              {project.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectSelect;
