import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Image as ImageIcon, ArrowRight, Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format";
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Include uppercase, lowercase, digit and special character";
    }

    if (formData.firstName.length < 2) {
      newErrors.firstName = "At least 2 characters";
    }

    if (formData.lastName.length < 2) {
      newErrors.lastName = "At least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await signup(formData);
      setMessage(response?.message || "Signup successful! Redirecting...");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: formData.email } });
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        "Signup failed. Please try again.";

      if (typeof errorMsg === "object") {
        setErrors(errorMsg);
      } else {
        setMessage(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] relative overflow-hidden px-4">
      {/* Background decorations */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <User className="text-white w-8 h-8" />
          </motion.div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-2">
            Create Account
          </h2>
          <p className="text-gray-400 font-medium">
            Join our platform and start your journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1 flex items-center gap-1">
                <User size={12} /> First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors.firstName ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/10"
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-400 text-[10px] mt-1 ml-2 font-medium">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1 flex items-center gap-1">
                <User size={12} /> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors.lastName ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/10"
                }`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-400 text-[10px] mt-1 ml-2 font-medium">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1 flex items-center gap-1">
              <Mail size={12} /> Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors.email ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/10"
                }`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-[10px] mt-1 ml-2 font-medium">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1 flex items-center gap-1">
              <Phone size={12} /> Phone Number
            </label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors.phoneNumber ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/10"
                }`}
                placeholder="1234567890"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-400 text-[10px] mt-1 ml-2 font-medium">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1 flex items-center gap-1">
              <ImageIcon size={12} /> Profile Image URL
            </label>
            <div className="relative group">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1 flex items-center gap-1">
              <Lock size={12} /> Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors.password ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/10"
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-[10px] mt-1 ml-2 font-medium">{errors.password}</p>
            )}
          </div>

          <motion.div
            initial={false}
            animate={message ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          >
            {message && (
              <div
                className={`px-4 py-3 rounded-2xl text-sm font-bold text-center border ${
                  message.includes("successful") || message.includes("Redirecting")
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {message}
              </div>
            )}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-4 rounded-2xl font-black tracking-widest uppercase hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign Up <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-400"
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
