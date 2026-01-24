
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfileData(response.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {user?.firstName} {user?.lastName}!
          </h2>
          <p className="text-gray-600 mb-4">{user?.email}</p>
          <div className="flex flex-wrap gap-2">
            {user?.roles?.map((role) => (
              <span key={role} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {role.replace('ROLE_', '')}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <p className="text-gray-600">
              Email Verified:{' '}
              <span className={`font-medium ${user?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                {user?.emailVerified ? 'Yes' : 'No'}
              </span>
            </p>
          </div>

          {hasRole('ROLE_ADMIN') && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Admin Access</h3>
              <p className="text-purple-700 mb-4">You have administrator privileges</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 font-medium">
                Go to Admin Panel
              </button>
            </div>
          )}

          {hasRole('ROLE_VENDOR') && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Vendor Dashboard</h3>
              <p className="text-green-700 mb-4">Manage your products and orders</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium">
                Go to Vendor Panel
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;