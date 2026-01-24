import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RefreshCw, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP } = useAuth();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Enter 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyOTP({ email, otpCode: otpCode });
      setMessage(response?.message || 'Verification successful!');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const response = await resendOTP(email);
      setMessage('New code dispatched!');
      setCanResend(false);
      setResendTimer(60);
    } catch (error) {
      setError('Resend failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] relative overflow-hidden px-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl text-center"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl ${
              isSuccess ? 'bg-green-500' : 'bg-blue-600'
            } transition-colors duration-500`}
          >
            {isSuccess ? <CheckCircle2 className="text-white w-10 h-10" /> : <ShieldCheck className="text-white w-10 h-10" />}
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-3">Check Your Inbox</h2>
          <p className="text-gray-400 font-medium text-sm">
            We sent a code to <span className="text-blue-400 underline decoration-blue-400/30 underline-offset-4">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                id={`otp-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full h-16 text-center text-3xl font-black bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all caret-transparent"
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {(error || message) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`py-3 rounded-2xl text-sm font-black border ${
                  error ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                }`}
              >
                {error || message}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || isSuccess}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-black tracking-widest uppercase shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Code'}
          </motion.button>
        </form>

        <div className="mt-10">
          {canResend ? (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={handleResend} 
              className="text-blue-400 hover:text-blue-300 font-bold flex items-center justify-center gap-2 mx-auto uppercase text-xs tracking-widest"
            >
              <RefreshCw size={14} /> Resend New Code
            </motion.button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <RefreshCw size={14} className="animate-spin text-gray-700" /> resend available in {resendTimer}s
            </div>
          )}
        </div>

        <Link to="/signup" className="mt-8 flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em]">
          <ArrowLeft size={14} /> Change Email
        </Link>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
