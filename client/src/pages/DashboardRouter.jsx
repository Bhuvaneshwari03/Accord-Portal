import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardRouter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role
    if (user) {
      switch (user.role) {
        case 'student':
          navigate('/student');
          break;
        case 'faculty':
        case 'admin':
          navigate('/faculty');
          break;
        default:
          navigate('/login');
      }
    }
  }, [user, navigate]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardRouter;