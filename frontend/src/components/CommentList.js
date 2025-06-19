import { useEffect, useState } from 'react';
import api from '../services/api';

const CommentList = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get('/comments/task/' + taskId);
        setComments(res.data);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    if (taskId) {
      fetchComments();
    }
  }, [taskId]);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="p-4 bg-background DEFAULT rounded shadow">
              <p className="mb-2">{comment.text}</p>
              <div className="text-sm text-text DEFAULT">
                <span>By: User ID {comment.userId || 'Unknown'}</span> | <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-sm text-gray-500 italic">Note: User names are not available due to backend limitations.</p>
    </div>
  );
};

export default CommentList;
