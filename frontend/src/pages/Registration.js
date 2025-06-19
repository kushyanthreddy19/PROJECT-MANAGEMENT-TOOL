import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // Role is not sent, backend defaults to Developer
      const response = await api.post('/auth/register', formData);
      setSuccess('Registration successful. You can now log in.');
      setFormData({
        name: '',
        email: '',
        password: '',
      });
      // Optionally navigate to login page
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-background DEFAULT rounded shadow transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-primary DEFAULT">User Registration</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-text DEFAULT" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary DEFAULT transition-colors duration-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-text DEFAULT" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary DEFAULT transition-colors duration-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-text DEFAULT" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary DEFAULT transition-colors duration-300"
          />
        </div>
        <button
          type="submit"
          className="bg-primary DEFAULT text-white px-4 py-2 rounded hover:bg-primary dark:hover:bg-primary transition-colors duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Registration;
