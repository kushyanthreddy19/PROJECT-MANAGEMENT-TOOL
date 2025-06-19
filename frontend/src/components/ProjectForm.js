import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProjectForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('planned');
  const [dueDate, setDueDate] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        // Filter users by role
        setDevelopers(res.data.filter(user => user.role === 'Developer'));
        setManagers(res.data.filter(user => user.role === 'Manager'));
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/projects', {
        name,
        description,
        status,
        dueDate,
        developers: selectedDevelopers,
        managers: selectedManagers,
      });
      navigate('/projects');
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    }
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="name">Project Name</label>
          <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="status">Status</label>
          <select
            id="status"
            className="w-full px-3 py-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="planned">Planned</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            className="w-full px-3 py-2 border rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
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
          Create Project
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
