import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Shield, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  Loader2
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    // Implement block/unblock logic
    console.log(`${action} user ${userId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1B254B]">User Management</h2>
          <p className="text-gray-500 font-medium">Manage platform users, roles, and security access.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email..." 
              className="pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 shadow-sm text-gray-500">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                        {user.image ? <img src={user.image} className="w-full h-full rounded-full" /> : user.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-[#1B254B]">{user.name}</div>
                        <div className="text-xs text-gray-400 font-medium">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${user.role === 'Admin' ? 'bg-purple-50 text-purple-600' : 
                        user.role === 'Vendor' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${
                         user.status === 'Active' ? 'bg-green-500' :
                         user.status === 'Blocked' ? 'bg-red-500' : 'bg-orange-400'
                       }`} />
                       <span className="text-sm font-bold text-gray-600">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-500">{user.activity}</span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Showing 1 to 4 of 12,458 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 bg-white">Previous</button>
            <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/30">1</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 bg-white">2</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 bg-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
