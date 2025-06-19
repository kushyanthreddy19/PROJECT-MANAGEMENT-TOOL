import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaProjectDiagram, FaTasks } from 'react-icons/fa';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-primary DEFAULT">Loading dashboard data...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-background DEFAULT rounded shadow transition-colors duration-300">
      <h1 className="text-3xl font-extrabold mb-6 text-primary DEFAULT">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          className="flex items-center p-6 bg-white rounded shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={() => navigate('/projects')}
        >
          <FaProjectDiagram className="text-blue-500 text-4xl mr-4" />
          <div>
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-2xl font-bold">{projects.length}</p>
          </div>
        </div>
        <div
          className="flex items-center p-6 bg-white rounded shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={() => navigate('/tasks')}
        >
          <FaTasks className="text-green-500 text-4xl mr-4" />
          <div>
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
