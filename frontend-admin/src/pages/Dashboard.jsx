import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  UserCircle, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Store, 
  Bell, 
  Search,
  Menu,
  X,
  CreditCard,
  Package,
  Activity,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const stats = [
    { label: 'Activity', value: 'High', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Verified', value: user?.emailVerified ? 'Yes' : 'No', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Plan', value: 'Premium', icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05060F]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060F] text-white flex flex-col md:flex-row font-sans selection:bg-blue-500/30">
      {/* Sidebar - Mobile Toggle */}
      <div className="md:hidden p-4 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#05060F]/80 backdrop-blur-xl z-50">
        <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">PLATFORM</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white/5 rounded-lg">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(sidebarOpen || !window.matchMedia('(max-width: 768px)').matches) && (
          <motion.aside 
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            className={`fixed md:relative z-40 w-64 h-full min-h-screen bg-[#080914] border-r border-white/5 flex flex-col p-6 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          >
            <div className="mb-10 hidden md:block">
              <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent italic">
                AETHER.
              </h1>
            </div>

            <nav className="flex-1 space-y-2">
              <NavItem icon={LayoutDashboard} label="Overview" active />
              <NavItem icon={Package} label="Products" />
              <NavItem icon={Store} label="Marketplace" />
              <NavItem icon={UserCircle} label="Profile" />
              <NavItem icon={Settings} label="Settings" />
            </nav>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-sm"
              >
                <LogOut size={18} /> Logout Session
              </button>
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#080914] flex items-center justify-center">
                      <UserCircle size={20} className="text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-black truncate w-24">{user?.firstName}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user?.roles?.[0]?.replace('ROLE_', '') || 'User'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-5xl font-black tracking-tighter"
            >
              Control Center.
            </motion.h2>
            <p className="text-gray-500 font-medium mt-2">Welcome back to your analytical oversight.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Deep Search..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all font-medium text-sm"
              />
            </div>
            <button className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#05060F]" />
            </button>
          </div>
        </header>

        {/* Hero Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative bg-gradient-to-r from-blue-600/10 to-indigo-700/10 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
            
            <div className="max-w-xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" /> Live Status
              </div>
              <h3 className="text-4xl md:text-6xl font-black leading-tight mb-4">
                Greetings, {user?.firstName}.
              </h3>
              <p className="text-blue-200/60 font-medium text-lg mb-8 leading-relaxed">
                Your console is synchronized. You have full access to {user?.roles?.length} authenticated modules.
              </p>
              <button className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-tighter hover:bg-blue-50 transition-colors">
                Quick Action <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/10 transition-all group"
            >
              <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </motion.div>
          ))}
        </section>

        {/* Specialized Views (Role Based) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {hasRole('ROLE_ADMIN') && (
            <RoleCard 
              title="Authority Cluster" 
              subtitle="Administrative protocols enabled."
              icon={ShieldCheck} 
              color="from-purple-500/20 to-pink-500/20"
              borderColor="border-purple-500/20"
              buttonText="Open Protocols"
            />
          )}

          {hasRole('ROLE_VENDOR') && (
            <RoleCard 
              title="Commerce Matrix" 
              subtitle="Vendor subsystems active."
              icon={Store} 
              color="from-emerald-500/20 to-teal-500/20"
              borderColor="border-emerald-500/20"
              buttonText="Sync Marketplace"
            />
          )}
        </section>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active }) => (
  <button className={`flex items-center gap-4 w-full px-4 py-4 rounded-2xl transition-all font-bold text-sm ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    <Icon size={20} /> {label}
  </button>
);

const RoleCard = ({ title, subtitle, icon: Icon, color, borderColor, buttonText }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${color} ${borderColor} border rounded-[3rem] p-10 flex flex-col justify-between h-72 group`}
  >
    <div>
      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:bg-white/20 transition-colors">
        <Icon size={30} />
      </div>
      <h4 className="text-3xl font-black text-white mb-2">{title}</h4>
      <p className="text-gray-400 font-medium">{subtitle}</p>
    </div>
    <button className="flex items-center gap-2 text-white font-black uppercase text-xs tracking-widest hover:gap-3 transition-all">
      {buttonText} <ChevronRight size={16} />
    </button>
  </motion.div>
);

export default Dashboard;
