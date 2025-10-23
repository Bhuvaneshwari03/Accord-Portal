import React from 'react';
import { AuthProvider } from "./contexts/AuthContext";
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from "./pages/Login";
import StudentPanel from './pages/StudentPanel';
import FacultyPanel from './pages/FacultyPanel';
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Optional Loading spinner wrapper
const LoadingWrapper = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LoadingWrapper>
          <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/student/*"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentPanel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty/*"
                  element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <FacultyPanel />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </LoadingWrapper>
      </AuthProvider>
    </Router>
  );
}


export default App;