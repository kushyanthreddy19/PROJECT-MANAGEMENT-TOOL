import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import CommentList from '../components/CommentList';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        setError('Failed to load task details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) return <div>Loading task details...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!task) return <div>No task found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
      <p className="mb-4">{task.description}</p>
      <div className="flex space-x-4 text-sm text-gray-600">
        <span>Status: {task.status}</span>
        <span>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
      </div>
      <CommentList taskId={id} />
    </div>
  );
};

export default TaskDetail;
