import { useState } from "react";
import { loginUser } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, Mail, Lock, Loader } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const res = await loginUser({ email, password });
      
      if (!res.data.token) {
        throw new Error("No token received");
      }

      login({ 
        role: res.data.role, 
        name: res.data.name,
        email: res.data.email
      }, res.data.token);

      // Redirect based on role
      const from = location.state?.from?.pathname || getRoleBasedPath(res.data.role);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const getRoleBasedPath = (role) => {
    switch (role) {
      case "student": return "/student";
      case "faculty": return "/faculty";
      case "admin": return "/admin";
      default: return "/";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Please sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="py-1">
                  <svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>{error}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin -ml-1 h-5 w-5" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign in</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-600 p-12">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Student Leave Portal</h2>
            <p className="text-xl text-blue-100 mb-8">Manage your leaves efficiently and securely</p>
            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Easy Application</h3>
                <p className="text-sm text-blue-100">Apply for leaves with just a few clicks</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Quick Response</h3>
                <p className="text-sm text-blue-100">Get updates on your applications instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
