import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  // Show a loading screen while auth is being checked
  if (auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FFDBBB] via-[#CCBEB1] to-[#997E67]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#664930] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p 
            className="text-xl font-semibold text-[#664930]"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Loading...
          </p>
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
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#FFDBBB] via-[#CCBEB1] to-[#997E67]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#664930] to-[#997E67] rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-[#FFDBBB]"
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

        <h2 
          className="text-5xl font-bold text-center mb-3 text-[#664930] drop-shadow-sm"
          style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
        >
          Welcome Back
        </h2>
        <p 
          className="text-center text-[#664930]/70 mb-8 text-xl"
          style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
        >
          Sign in to your Accord Portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label 
              htmlFor="email" 
              className="block font-semibold text-[#664930] mb-2"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#664930]/20 rounded-lg focus:border-[#664930] focus:ring-1 focus:ring-[#664930] focus:outline-none transition-all duration-200 bg-white/60 backdrop-blur-sm text-[#664930] hover:bg-white/80"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block font-semibold text-[#664930] mb-2"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#664930]/20 rounded-lg focus:border-[#664930] focus:ring-1 focus:ring-[#664930] focus:outline-none transition-all duration-200 bg-white/60 backdrop-blur-sm pr-12 text-[#664930] hover:bg-white/80"
                style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#997E67] hover:text-[#664930] transition-colors"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="bg-red-500/20 border border-red-600/30 text-red-900 px-4 py-3 rounded-lg text-sm font-medium text-center"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg font-semibold text-[#FFDBBB] bg-[#664930] hover:bg-[#997E67] focus:outline-none focus:ring-2 focus:ring-[#664930] shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p 
            className="text-[#664930]/70"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-bold text-[#664930] hover:text-[#997E67] transition-colors duration-300"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;