import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Map, 
  List, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Activity,
  Box,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Store, label: 'Vendor Approvals', path: '/admin/vendors/pending' },
    { icon: List, label: 'All Vendors', path: '/admin/vendors' },
    { icon: Map, label: 'Live Map', path: '/admin/map' },
    { icon: Box, label: 'Products', path: '/admin/products' },
    { icon: FileText, label: 'Audit Logs', path: '/admin/audit-logs' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-[#1B254B] font-sans flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 290 : 80 }}
        className="bg-white z-20 h-screen flex flex-col fixed left-0 top-0 border-r border-gray-100 shadow-xl shadow-gray-100/50 transition-all duration-300"
      >
        <div className="h-24 flex items-center justify-center border-b border-gray-50/50">
          <h1 className={`font-black text-2xl tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300 ${!sidebarOpen && 'scale-0 opacity-0 absolute'}`}>
            VENDOR<span className="text-[#1B254B]">ADMIN</span>
          </h1>
          {!sidebarOpen && <Store className="text-blue-600 w-8 h-8" />}
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link to={item.path} key={item.path}>
                <div className={`
                  flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group relative overflow-hidden
                  ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}
                `}>
                  <item.icon size={22} className={`transition-transform duration-300 ${!sidebarOpen && 'mx-auto'}`} />
                  <span className={`font-bold text-sm tracking-wide whitespace-nowrap transition-all duration-300 ${!sidebarOpen && 'opacity-0 w-0 hidden'}`}>
                    {item.label}
                  </span>
                  {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full" />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={logout}
            className={`flex items-center gap-4 px-4 py-4 rounded-xl text-red-500 hover:bg-red-50 w-full transition-all duration-200 ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut size={22} />
            <span className={`font-bold text-sm transition-all duration-300 ${!sidebarOpen && 'opacity-0 w-0 hidden'}`}>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-[290px]' : 'ml-[80px]'}`}>
        
        {/* Topbar */}
        <header className="h-24 bg-white/80 backdrop-blur-xl sticky top-0 z-10 px-8 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-[#F4F7FE] rounded-full border-none focus-within:ring-2 ring-blue-500/20 transition-all w-96">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 w-full placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#1B254B]">{user?.firstName || 'Admin'}</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {user?.image ? (
                   <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-blue-600">{user?.firstName?.[0] || 'A'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
