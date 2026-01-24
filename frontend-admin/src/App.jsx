
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import VendorApprovals from './pages/admin/VendorApprovals';
import LiveMap from './pages/admin/LiveMap';
import VendorList from './pages/admin/VendorList';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* User Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="vendors/pending" element={<VendorApprovals />} />
            <Route path="vendors" element={<VendorList />} />
            <Route path="map" element={<LiveMap />} />
            <Route path="products" element={<div>Products Management</div>} />
            <Route path="audit-logs" element={<div>Audit Logs</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>

          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
