import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  // Show a loading screen while auth is being checked
  if (auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // If already logged in, go to dashboard
  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await auth.login(email, password);
      navigate('/dashboard'); // redirect after successful login
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80)',
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-indigo-900/50 to-purple-900/50 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-md p-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-5xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-10 text-xl">
          Sign in to your student portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-3">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-300 bg-gray-50"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-3">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-300 bg-gray-50"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div
              className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl text-base font-medium text-center"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-blue-600 transition-colors duration-300">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
