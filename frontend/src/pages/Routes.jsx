import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SuperadminDashboard from './Superadmin/SuperadminDashboard';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import EmployeeDashboard from './Employee/EmployeeDashboard';
import { getUserRole, isAuthenticated } from '../utils/auth';
import ProtectedRoute from '../pages/PrivateRoute';

const Routers = () => {
  const [role, setRole] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const userRole = getUserRole();
      setRole(userRole);
    }
    setAuthChecked(true);
  }, []);

  if (!authChecked) return null;

  return (
    <Routes>
      <Route path="/" element={<LoginPage setRole={setRole} />} />
      <Route path="/login" element={<LoginPage setRole={setRole} />} />

      {/* ✅ SuperAdmin Routes */}
      <Route
        path="/client"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated() && role === 'superadmin'}>
            <SuperadminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ Admin Dashboard + Tabs Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated() && role === 'admin'}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employeelist"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated() && role === 'admin'}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated() && role === 'admin'}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/permission"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated() && role === 'admin'}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ Employee Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated() && role === 'employee'}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ Default Role-Based Redirect */}
      <Route
        path="*"
        element={
          isAuthenticated() ? (
            role === 'superadmin' ? (
              <Navigate to="/client" />
            ) : role === 'admin' ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default Routers;
