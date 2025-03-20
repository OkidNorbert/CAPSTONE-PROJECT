import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/Dashboard/AdminDashboard';
import AdminSettings from '../components/admin/Settings/AdminSettings';
import { useAuth } from '../context/AuthContext';

const AdminRoutes = () => {
  const { currentUser } = useAuth();

  // Redirect if not logged in or not an admin
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/settings" element={<AdminSettings />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes; 