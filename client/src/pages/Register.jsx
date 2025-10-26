import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react'; // <-- 1. Import icons

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- 2. Add state
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { name, email, password, role });
      navigate('/login');
    } catch (err) {
      setError('Failed to register. User may already exist.');
      console.error(err);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80)',
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-sm"></div>
      
      <div className="relative z-10 p-10 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md">
        {/* Logo/Icon Area */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-8 text-lg">Student portal leave</p>

        <form onSubmit={handleSubmit} className="space-y-6"> {/* Added space-y-6 */}
          <div className="mb-0"> {/* Removed mb-6, letting space-y handle it */}
            <label className="block text-gray-700 mb-3 text-lg font-semibold" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-0">
            <label className="block text-gray-700 mb-3 text-lg font-semibold" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-0">
            <label className="block text-gray-700 mb-3 text-lg font-semibold" htmlFor="password">
              Password
            </label>
            {/* 3. Add relative positioning wrapper */}
            <div className="relative">
              <input
                // 4. Change type based on state
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // 5. Add padding-right (pr-14) to make space for icon
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 pr-14"
                placeholder="Create a strong password"
                required
              />
              {/* 6. Add the icon button */}
              <button
                type="button" // Important: prevents form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
              </button>
            </div>
          </div>

          <div className="mb-0">
            <label className="block text-gray-700 mb-3 text-lg font-semibold">
              I am a
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 cursor-pointer"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
              <p className="text-red-600 text-base font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl text-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-lg">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:text-purple-600 transition-colors duration-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;