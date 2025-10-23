import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute'; // For role-specific routes

// Import your panels
import StudentPanel from './StudentPanel';
import FacultyPanel from './FacultyPanel';
// import AdminPanel from './AdminPanel'; // If you have one
import Navbar from '../components/Navbar'; // Your navigation bar

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar /> {/* Your persistent navbar */}
    <main className="p-4">
      {children}
    </main>
  </div>
);

function DashboardRouter() {
  const { user } = useAuth();

  // This is the main router for *inside* the dashboard
  // It uses the `DashboardLayout` to show the Navbar on every page.
  return (
    <DashboardLayout>
      <Routes>
        {/*
          Route for Students
          - Uses ProtectedRoute to ensure ONLY 'student' role can access it.
        */}
        <Route element={<ProtectedRoute roles={['student']} />}>
          <Route path="student" element={<StudentPanel />} />
        </Route>

        {/* Route for Faculty
          - Uses ProtectedRoute to ensure ONLY 'faculty' role can access it.
        */}
        <Route element={<ProtectedRoute roles={['faculty', 'admin']} />}>
          <Route path="faculty" element={<FacultyPanel />} />
        </Route>
        
        {/*
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="admin" element={<AdminPanel />} />
        </Route>
        */}

        {/* Default Dashboard Route
          This route redirects the user to their specific panel
          based on their role as soon as they hit "/dashboard"
        */}
        <Route
          index // This matches the base "/dashboard"
          element={
            user.role === 'student' ? <Navigate to="student" replace /> :
            user.role === 'faculty' ? <Navigate to="faculty" replace /> :
            // user.role === 'admin' ? <Navigate to="admin" replace /> :
            <Navigate to="/login" replace /> // Fallback
          }
        />
      </Routes>
    </DashboardLayout>
  );
}

export default DashboardRouter;