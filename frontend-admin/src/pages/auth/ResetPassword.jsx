import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { motion } from 'framer-motion';
import { KeyRound, ShieldCheck, Mail, Lock, ArrowLeft, Loader2, Save } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email required');
      return false;
    }
    if (!formData.otp) {
      setError('OTP required');
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError('Password too short (8+)');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authAPI.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      setMessage('Password updated! Entry allowed.');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error) {
      setError(error.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] relative overflow-hidden px-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-neutral-950/40" />
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
          >
            <ShieldCheck className="text-white w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Finalize Recovery</h2>
          <p className="text-gray-400 font-medium">Define your new access credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest flex items-center gap-1">
                <Mail size={10} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm font-medium"
                required
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest flex items-center gap-1">
                <KeyRound size={10} /> Recovery OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm font-medium"
                required
                placeholder="6-digit code"
                maxLength="6"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest flex items-center gap-1">
              <Lock size={10} /> New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm font-medium"
              required
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest flex items-center gap-1">
              <Lock size={10} /> Confirm Credentials
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm font-medium"
              required
              placeholder="••••••••"
            />
          </div>

          {(error || message) && (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`px-5 py-3 rounded-2xl text-xs font-black text-center border ${
                error ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
              }`}
            >
              {error || message}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-5 rounded-2xl font-black tracking-widest uppercase shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-4"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Save Credentials <Save size={18} /></>}
          </motion.button>
        </form>

        <Link to="/login" className="mt-10 flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]">
          <ArrowLeft size={14} /> Abandon Flow
        </Link>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
