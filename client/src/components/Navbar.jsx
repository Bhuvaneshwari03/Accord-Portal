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
    <nav className="bg-gradient-to-r from-[#664930] via-[#997E67] to-[#CCBEB1] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="text-2xl font-bold text-[#FFDBBB] hover:text-white transition-colors duration-200"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            >
              Accord-Portal
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <span 
                  className="text-[#FFDBBB] font-medium"
                  style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
                >
                  Welcome, <span className="font-bold">{user.name}</span>
                  <span className="text-white/80 ml-2 text-sm">({user.role})</span>
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-gradient-to-br from-red-500 to-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200 border border-red-400/50"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
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