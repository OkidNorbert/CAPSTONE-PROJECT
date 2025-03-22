import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/Dashboard/AdminDashboard';
import AdminSettings from '../components/admin/Settings/AdminSettings';
import UserManagement from '../components/admin/Dashboard/UserManagement';
import JobManagement from '../components/admin/Dashboard/JobManagement';
import UserReport from '../components/admin/Reports/UserReport';
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
      <Route path="/users" element={<UserManagement />} />
      <Route path="/jobs" element={<JobManagement />} />
      <Route path="/reports" element={<UserReport />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes; 