import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'planned',
  });
  const [developers, setDevelopers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setDevelopers(res.data.filter(user => user.role === 'Developer'));
        setManagers(res.data.filter(user => user.role === 'Manager'));
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };

    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        const data = res.data;
        setProject({
          name: data.name || '',
          description: data.description || '',
          dueDate: data.dueDate ? data.dueDate.split('T')[0] : '',
          status: data.status || 'planned',
        });
        setSelectedDevelopers(data.developers ? data.developers.map(dev => dev.id) : []);
        setSelectedManagers(data.managers ? data.managers.map(mgr => mgr.id) : []);
      } catch (err) {
        setError('Failed to load project');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeveloperChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedDevelopers(selected);
  };

  const handleManagerChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedManagers(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/projects/${id}`, {
        ...project,
        developers: selectedDevelopers,
        managers: selectedManagers,
      });
      // Fetch updated project data to refresh assigned users
      const res = await api.get(`/projects/${id}`);
      const data = res.data;
      setSelectedDevelopers(data.developers ? data.developers.map(dev => dev.id) : []);
      setSelectedManagers(data.managers ? data.managers.map(mgr => mgr.id) : []);
      navigate('/projects');
    } catch (err) {
      setError('Failed to update project');
      console.error(err);
    }
  };

  if (loading) return <div>Loading project...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={project.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            value={project.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded h-24"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-gray-700 mb-2">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={project.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="status" className="block text-gray-700 mb-2">Status</label>
          <select
            id="status"
            name="status"
            value={project.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="developers">Assign Developers</label>
          <select
            id="developers"
            multiple
            className="w-full px-3 py-2 border rounded"
            value={selectedDevelopers}
            onChange={handleDeveloperChange}
          >
            {developers.map((dev) => (
              <option key={dev.id} value={dev.id}>{dev.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="managers">Assign Managers</label>
          <select
            id="managers"
            multiple
            className="w-full px-3 py-2 border rounded"
            value={selectedManagers}
            onChange={handleManagerChange}
          >
            {managers.map((mgr) => (
              <option key={mgr.id} value={mgr.id}>{mgr.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
        >
          Update Project
        </button>
      </form>
    </div>
  );
};

export default ProjectEdit;
