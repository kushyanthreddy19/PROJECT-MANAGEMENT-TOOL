import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaTachometerAlt, FaProjectDiagram, FaTasks, FaUserPlus, FaUsers, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white text-gray-800 shadow-md transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold hover:text-blue-600 transition-colors duration-300 flex items-center space-x-2">
          <FaProjectDiagram />
          <span>Project Manager</span>
        </Link>
        <button
          className="md:hidden focus:outline-none text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <div className={`flex-col md:flex md:flex-row md:items-center md:space-x-4 absolute md:static bg-white md:bg-transparent w-full md:w-auto left-0 md:left-auto top-16 md:top-auto transition-all duration-300 ease-in-out ${menuOpen ? 'block' : 'hidden'}`}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-blue-100 transition-colors duration-300 flex items-center space-x-1">
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>
              <div className="relative group">
                <button className="px-3 py-2 rounded hover:bg-blue-100 transition-colors duration-300 w-full text-left md:w-auto flex items-center space-x-1">
                  <FaProjectDiagram />
                  <span>Projects</span>
                </button>
                <div className="absolute left-0 mt-1 w-40 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:block">
                  <Link to="/projects" className="block px-4 py-2 hover:bg-blue-100 flex items-center space-x-1">
                    <FaProjectDiagram />
                    <span>Project List</span>
                  </Link>
                  <Link to="/projects/new" className="block px-4 py-2 hover:bg-blue-100 flex items-center space-x-1">
                    <FaProjectDiagram />
                    <span>New Project</span>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button className="px-3 py-2 rounded hover:bg-blue-100 transition-colors duration-300 w-full text-left md:w-auto flex items-center space-x-1">
                  <FaTasks />
                  <span>Tasks</span>
                </button>
                <div className="absolute left-0 mt-1 w-40 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:block">
                  <Link to="/tasks" className="block px-4 py-2 hover:bg-blue-100 flex items-center space-x-1">
                    <FaTasks />
                    <span>Task List</span>
                  </Link>
                </div>
              </div>
              <Link to="/generate-user-story" className="px-3 py-2 rounded hover:bg-blue-100 transition-colors duration-300 flex items-center space-x-1">
                <FaUserPlus />
                <span>Generate User Story</span>
              </Link>
              {user?.role === 'Admin' && (
                <>
                  <Link to="/admin/register" className="px-3 py-2 rounded hover:bg-blue-200 flex items-center space-x-1">
                    <FaUserPlus />
                    <span>Register User</span>
                  </Link>
                  <Link to="/admin/users" className="px-3 py-2 rounded hover:bg-blue-200 flex items-center space-x-1">
                    <FaUsers />
                    <span>User List</span>
                  </Link>
                </>
              )}
              <div className="flex items-center space-x-2 px-3 py-2">
                <FaUser />
                <span>Hello, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded transition-colors duration-300 flex items-center space-x-1"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-1">
                <FaUser />
                <span>Login</span>
              </Link>
              <Link to="/register" className="ml-2 px-3 py-2 rounded bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors duration-300 flex items-center space-x-1">
                <FaUserPlus />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
