import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth(); // Get user info and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
              Accord-Portal
            </Link>
          </div>
          <div className="flex items-center">
            {user && (
              <span className="text-gray-700 mr-4">
                Welcome, {user.name} ({user.role})
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;