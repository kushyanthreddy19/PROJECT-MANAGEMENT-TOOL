import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const UserStoryForm = () => {
  const { projectId } = useParams();
  const [input, setInput] = useState('');
  const [userStory, setUserStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/ai/generate-user-stories', {
        projectId,
        projectDescription: input,
      });
      setUserStory(res.data.join('\n\n'));
    } catch (err) {
      setError('Failed to generate user story');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">AI User Story Generator</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Describe the feature or requirement:
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border rounded h-32"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a description of what you need (e.g., 'As a user, I want to be able to reset my password')"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Generating...' : 'Generate User Story'}
        </button>
      </form>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {userStory && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Generated User Story:</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-wrap">
            {userStory}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => navigator.clipboard.writeText(userStory)}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStoryForm;
