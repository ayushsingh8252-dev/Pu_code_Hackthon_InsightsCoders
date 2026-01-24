import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  MapPin, 
  ExternalLink,
  Store,
  Calendar,
  Search
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const VendorApprovals = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const fetchPendingVendors = async () => {
    try {
      const response = await adminAPI.getPendingVendors();
      setVendors(response.data);
    } catch (error) {
      console.error('Failed to fetch pending vendors', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveVendor(id);
      setVendors(vendors.filter(v => v.id !== id));
    } catch (error) {
      console.error('Failed to approve vendor', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.rejectVendor(id);
      setVendors(vendors.filter(v => v.id !== id));
    } catch (error) {
      console.error('Failed to reject vendor', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1B254B]">Vendor Approvals</h2>
          <p className="text-gray-500 font-medium">Review and process new business applications.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm w-full sm:w-auto">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search pending..." 
            className="bg-transparent border-none outline-none text-sm font-medium w-full sm:w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Business Name</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Owner Email</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">City</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                        <Store size={20} />
                      </div>
                      <span className="font-bold text-[#1B254B]">{vendor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-500">{vendor.email}</span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      vendor.type === 'Mobile Vendor' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {vendor.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                      {vendor.city}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                      {vendor.date}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => handleApprove(vendor.id)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                         <Check size={18} strokeWidth={3} />
                       </button>
                       <button onClick={() => handleReject(vendor.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                         <X size={18} strokeWidth={3} />
                       </button>
                       <button className="px-3 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                         View
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorApprovals;
