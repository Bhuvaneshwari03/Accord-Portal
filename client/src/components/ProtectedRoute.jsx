import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's role
    const redirectPath = user.role === 'student' ? '/student' : 
                        user.role === 'faculty' ? '/faculty' : 
                        user.role === 'admin' ? '/faculty' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
