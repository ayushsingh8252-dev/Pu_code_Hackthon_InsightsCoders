import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('Sending forgot password request for:', email);
      const response = await authAPI.forgotPassword({ email });
      console.log('Forgot password response:', response);
      
      // Backend returns success message even if email doesn't exist (security best practice)
      setMessage('If an account exists for this email, an OTP has been sent. Check your inbox.');
      
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (error) {
      console.error('Forgot password error:', error);
      console.error('Error response:', error.response);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        setError('Authentication required. Please login first.');
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.message || 'Invalid email format. Please try again.');
      } else {
        const errorMsg =
          error.response?.data?.message || error.message || 'Failed to send reset email. Please try again.';
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              required
              placeholder="Enter your email"
            />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password? <Link to="/login" className="text-purple-600 hover:text-purple-500 font-medium">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;