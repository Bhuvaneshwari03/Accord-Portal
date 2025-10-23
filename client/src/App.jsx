import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardRouter from './pages/DashboardRouter'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Protected Routes 
        All routes inside /dashboard/* will first check if the user is logged in.
      */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<DashboardRouter />} />
      </Route>

      {/* Add a fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;