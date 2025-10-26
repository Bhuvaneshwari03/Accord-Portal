import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#FFDBBB] via-[#CCBEB1] to-[#997E67]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#664930] to-[#997E67] rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-[#FFDBBB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        <h2 
          className="text-5xl font-bold text-center mb-3 text-[#664930] drop-shadow-sm"
          style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
        >
          Create Account
        </h2>
        <p 
          className="text-center text-[#664930]/70 mb-8 text-xl"
          style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
        >
          Accord portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label 
              className="block font-semibold text-[#664930] mb-2" 
              htmlFor="name"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-[#664930]/20 rounded-lg focus:border-[#664930] focus:ring-1 focus:ring-[#664930] focus:outline-none transition-all duration-200 bg-white/60 backdrop-blur-sm text-[#664930] hover:bg-white/80"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label 
              className="block font-semibold text-[#664930] mb-2" 
              htmlFor="email"
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
            />
          </div>

          <div>
            <label 
              className="block font-semibold text-[#664930] mb-2" 
              htmlFor="password"
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
                placeholder="Create a strong password"
                required
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

          <div>
            <label 
              className="block font-semibold text-[#664930] mb-2"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            >
              I am a
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-[#664930]/20 rounded-lg focus:border-[#664930] focus:ring-1 focus:ring-[#664930] focus:outline-none transition-all duration-200 bg-white/60 backdrop-blur-sm cursor-pointer text-[#664930] hover:bg-white/80"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
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
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p 
            className="text-[#664930]/70"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-[#664930] hover:text-[#997E67] transition-colors duration-300"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
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