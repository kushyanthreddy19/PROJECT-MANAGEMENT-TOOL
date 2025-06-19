
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TaskEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'Pending',
    deadline: '',
    projectId: '',
    assignedTo: '',
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id === 'new') {
          // For new task, only fetch projects and users
          const [projectsRes, usersRes] = await Promise.all([
            api.get('/projects'),
            api.get('/users'),
          ]);
          setProjects(projectsRes.data);
          setUsers(usersRes.data);
          setTask({
            title: '',
            description: '',
            status: 'Pending',
            deadline: '',
            projectId: '',
            assignedTo: '',
          });
          setLoading(false);
        } else {
          // For existing task, fetch task, projects, and users
          const [taskRes, projectsRes, usersRes] = await Promise.all([
            api.get(`/tasks/${id}`),
            api.get('/projects'),
            api.get('/users'),
          ]);
          const data = taskRes.data;
          setTask({
            title: data.title || '',
            description: data.description || '',
            status: data.status || 'Pending',
            deadline: data.deadline ? data.deadline.split('T')[0] : '',
            projectId: data.projectId || '',
            assignedTo: data.assignedTo || '',
          });
          setProjects(projectsRes.data);
          setUsers(usersRes.data);
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (id === 'new') {
        await api.post('/tasks', task);
      } else {
        await api.put(`/tasks/${id}`, task);
      }
      navigate('/tasks');
    } catch (err) {
      setError(id === 'new' ? 'Failed to create task' : 'Failed to update task');
      console.error(err);
    }
  };

  if (loading) return <div>Loading task...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{id === 'new' ? 'Create Task' : 'Edit Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={task.title}
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
            value={task.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded h-24"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 mb-2">Status</label>
          <select
            id="status"
            name="status"
            value={task.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Pending">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="deadline" className="block text-gray-700 mb-2">Deadline</label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={task.deadline}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="projectId" className="block text-gray-700 mb-2">Project</label>
          <select
            id="projectId"
            name="projectId"
            value={task.projectId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="assignedTo" className="block text-gray-700 mb-2">Assigned To</label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={task.assignedTo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
        >
          {id === 'new' ? 'Create Task' : 'Update Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskEdit;
