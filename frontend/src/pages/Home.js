// src/pages/Home.js
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to Project Management Tool
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your projects and tasks efficiently
      </p>
      <div className="space-x-4">
        <Link 
          to="/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Login
        </Link>
        <Link 
          to="/dashboard" 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;