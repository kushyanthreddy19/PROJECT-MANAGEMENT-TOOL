import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        setError('Failed to load project details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div>Loading project details...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!project) return <div>No project found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      <p className="mb-4">{project.description}</p>
      <div className="flex space-x-4 text-sm text-gray-600">
        <span>Status: {project.status}</span>
        <span>Due Date: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</span>
      </div>
    </div>
  );
};

export default ProjectDetail;
