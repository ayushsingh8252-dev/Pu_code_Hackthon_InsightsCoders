import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { motion } from 'framer-motion';
import { KeyRound, Mail, ArrowLeft, Loader2, Send } from 'lucide-react';

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
      await authAPI.forgotPassword({ email });
      setMessage('Reset link dispatched if account exists.');
      
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2500);
    } catch (error) {
      setError(error.response?.data?.message || 'Request failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] relative overflow-hidden px-4">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-12 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-purple-500/20"
          >
            <KeyRound className="text-white w-10 h-10" />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Forgot Access?</h2>
          <p className="text-gray-400 font-medium leading-relaxed">
            Locked out? No worries. Enter your email and we'll send recovery steps.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-[0.3em] flex items-center gap-2">
              <Mail size={12} /> Recovery Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleChange}
              className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
              required
              placeholder="user@example.com"
            />
          </div>

          {(error || message) && (
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`px-5 py-3 rounded-2xl text-xs font-black text-center border ${
                error ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
              }`}
            >
              {error || message}
            </motion.div>
          )}

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full group bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-5 rounded-2xl font-black tracking-widest uppercase shadow-2xl shadow-purple-600/20 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Request Recovery <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
          </motion.button>
        </form>

        <Link to="/login" className="mt-10 flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]">
          <ArrowLeft size={14} /> Back to Entry
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
