import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Store, 
  Activity, 
  MapPin, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 12450,
    totalVendors: 840,
    activeVendors: 612,
    liveVendors: 45,
    userGrowth: 12,
    vendorGrowth: 5,
    activeGrowth: 2,
    liveGrowth: 8
  });
  
  const [loading, setLoading] = useState(false); // Set to true when real API is ready

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    }
  };

  const areaData = [
    { name: 'Week 1', users: 400 },
    { name: 'Week 2', users: 300 },
    { name: 'Week 3', users: 500 },
    { name: 'Week 4', users: 280 },
    { name: 'Week 5', users: 590 },
    { name: 'Week 6', users: 800 },
  ];

  const barData = [
    { name: 'Jan', vendors: 400 },
    { name: 'Feb', vendors: 300 },
    { name: 'Mar', vendors: 600 },
    { name: 'Apr', vendors: 200 },
    { name: 'May', vendors: 350 },
    { name: 'Jun', vendors: 500 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          change={stats.userGrowth} 
          icon={Users} 
          color="blue"
        />
        <StatCard 
          title="Total Vendors" 
          value={stats.totalVendors.toLocaleString()} 
          change={stats.vendorGrowth} 
          icon={Store} 
          color="indigo"
        />
        <StatCard 
          title="Active Vendors" 
          value={stats.activeVendors.toLocaleString()} 
          change={stats.activeGrowth} 
          icon={Activity} 
          color="emerald"
        />
        <StatCard 
          title="Live Vendors" 
          value={stats.liveVendors.toLocaleString()} 
          change={stats.liveGrowth} 
          icon={MapPin} 
          color="rose"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Signups Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800">User Signups</h3>
              <p className="text-sm text-gray-500 font-medium">Platform growth trajectory</p>
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-gray-500">New Users</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                  itemStyle={{color: '#3B82F6', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Registrations Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Vendor Registrations</h3>
              <p className="text-sm text-gray-500 font-medium">Monthly historical trends</p>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <MoreHorizontal className="text-gray-400" size={20} />
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <Tooltip
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                />
                <Bar dataKey="vendors" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Map Preview Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Live Vendor Map Preview</h3>
            <p className="text-sm text-gray-500 font-medium">Real-time geographical distribution</p>
          </div>
          <button className="text-blue-600 font-bold text-sm hover:underline">Full Map View &rarr;</button>
        </div>
        <div className="h-[400px] w-full bg-gray-100 rounded-2xl relative overflow-hidden group">
          {/* Placeholder Map Image/Effect */}
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-122.4194,37.7749,12,0/800x600@2x?access_token=YOUR_TOKEN')] bg-cover bg-center grayscale opacity-60 group-hover:grayscale-0 transition-all duration-500" />
          
          {/* Simulated Markers */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <div className="relative">
               <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute" />
               <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white relative z-10 shadow-lg" />
               
               {/* Tooltip */}
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-xl shadow-xl w-40 text-center"
               >
                 <p className="text-xs font-bold text-gray-800">Blue Bottle Coffee</p>
                 <p className="text-[10px] text-green-500 font-bold uppercase">Status: Live</p>
               </motion.div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;
  
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-black text-[#1B254B]">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(change)}%
        </span>
        <span className="text-gray-400 text-xs font-bold">from last month</span>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
