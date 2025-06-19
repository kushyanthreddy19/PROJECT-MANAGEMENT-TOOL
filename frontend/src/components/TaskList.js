import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = filter === 'all' ? '/tasks' : `/tasks?status=${filter}`;
        const res = await api.get(url);
        setTasks(res.data);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [filter]);

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <Link 
            to="/tasks/new" 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Create New Task
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                <Link to={`/tasks/${task.id}`} className="text-blue-600 hover:underline">
                  {task.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-2">{task.description || 'No description'}</p>
              <p className="text-sm text-gray-500 mb-1">Project: {task.Project?.name || 'N/A'}</p>
              <p className="text-sm text-gray-500 mb-1">
                Assigned To: {task.assignedUser ? `${task.assignedUser.name} (ID: ${task.assignedUser.id})` : 'N/A'}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Status: <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${task.status === 'done' ? 'bg-green-100 text-green-800' : 
                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {task.status}
                </span>
              </p>
              <p className="text-sm text-gray-500">Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="mt-4 flex space-x-4">
              <Link 
                to={`/tasks/${task.id}/edit`} 
                className="text-blue-600 hover:text-blue-900"
              >
                Edit
              </Link>
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    try {
                      await api.delete(`/tasks/${task.id}`);
                      setTasks((prev) => prev.filter((t) => t.id !== task.id));
                    } catch (error) {
                      alert('Failed to delete task');
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
        ))}
      </div>
    </div>
  );
};

export default TaskList;
