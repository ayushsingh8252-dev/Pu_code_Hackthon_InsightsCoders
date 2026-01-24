import React, { useState } from 'react';
import { Search, Filter, Power, MapPin, Store, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { adminAPI } from '../../services/api';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Action State
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve', 'reject', 'suspend'
  const [suspendReason, setSuspendReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getVendors();
      const vendorData = response.data.vendors || [];
      
      const mappedVendors = vendorData.map(v => {
        let status = 'Inactive';
        if (v.verificationStatus === 'APPROVED') {
          status = v.isActive ? 'Accepted' : 'Suspended';
        } else if (v.verificationStatus === 'REJECTED') {
          status = 'Rejected';
        } else if (v.verificationStatus === 'PENDING') {
          status = 'Pending';
        }

        return {
          id: v.vendorId,
          name: v.businessName,
          location: v.vendorType,
          status: status,
          items: v.totalReviews || 0,
          revenue: '-',
          rating: v.ratingAvg || 0,
          rawStatus: v.verificationStatus,
          isActive: v.isActive
        };
      });

      setVendors(mappedVendors);
    } catch (error) {
      console.error('Failed to fetch vendors', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVendors();
  }, []);

  const handleActionClick = (vendor, type) => {
    setSelectedVendor(vendor);
    setActionType(type);
    setSuspendReason('');
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedVendor || !actionType) return;

    try {
      if (actionType === 'approve') {
        await adminAPI.approveVendor(selectedVendor.id);
      } else if (actionType === 'reject') {
        await adminAPI.rejectVendor(selectedVendor.id);
      } else if (actionType === 'suspend') {
        await adminAPI.suspendVendor(selectedVendor.id, suspendReason);
      } else if (actionType === 'activate') {
        await adminAPI.activateVendor(selectedVendor.id);
      }
      
      // Refresh list
      fetchVendors();
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Failed to ${actionType} vendor`, error);
      alert(`Failed to ${actionType} vendor. Please try again.`);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1B254B]">All Vendors</h2>
          <p className="text-gray-500 font-medium">Manage all vendor accounts and statuses.</p>
        </div>
         <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              className="pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {vendors.map((vendor) => (
           <div key={vendor.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
             <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                   <Store size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-[#1B254B] text-lg leading-tight mb-1">{vendor.name}</h3>
                   <div className="flex items-center gap-1 text-gray-400 text-xs font-bold uppercase tracking-wide">
                     <MapPin size={12} /> {vendor.location}
                   </div>
                 </div>
               </div>
               <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  vendor.status === 'Accepted' ? 'bg-green-100 text-green-600' :
                  vendor.status === 'Suspended' ? 'bg-yellow-100 text-yellow-600' :
                  vendor.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
               }`}>
                 {vendor.status}
               </div>
             </div>

             <div className="grid grid-cols-3 gap-4 mb-6">
               <div className="text-center p-3 bg-gray-50 rounded-2xl">
                 <p className="text-xs text-gray-400 font-bold uppercase">Items</p>
                 <p className="text-lg font-black text-[#1B254B]">{vendor.items}</p>
               </div>
               <div className="text-center p-3 bg-gray-50 rounded-2xl">
                 <p className="text-xs text-gray-400 font-bold uppercase">Rev</p>
                 <p className="text-lg font-black text-[#1B254B]">{vendor.revenue}</p>
               </div>
                <div className="text-center p-3 bg-gray-50 rounded-2xl">
                 <p className="text-xs text-gray-400 font-bold uppercase">Rating</p>
                 <p className="text-lg font-black text-[#1B254B]">{vendor.rating}</p>
               </div>
             </div>

             <div className="mt-auto grid grid-cols-2 gap-2">
                {vendor.status === 'Pending' && (
                  <>
                    <button onClick={() => handleActionClick(vendor, 'approve')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 text-green-600 font-bold text-sm hover:bg-green-100 transition-colors">
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button onClick={() => handleActionClick(vendor, 'reject')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors">
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                {vendor.status === 'Accepted' && (
                  <button onClick={() => handleActionClick(vendor, 'suspend')} className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-50 text-yellow-600 font-bold text-sm hover:bg-yellow-100 transition-colors">
                    <Power size={16} /> Suspend Account
                  </button>
                )}
                 {vendor.status === 'Suspended' && (
                  <button onClick={() => handleActionClick(vendor, 'activate')} className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 text-green-600 font-bold text-sm hover:bg-green-100 transition-colors">
                    <Power size={16} /> Activate Account
                  </button>
                )}
                {vendor.status === 'Rejected' && (
                  <button disabled className="col-span-2 py-3 rounded-xl bg-gray-50 text-gray-400 font-bold text-sm cursor-not-allowed">
                    Rejected
                  </button>
                )}
             </div>
           </div>
         ))}
       </div>

       {/* Action Modal */}
       {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
           <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black text-[#1B254B] capitalize">
                 {actionType} Vendor
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                 <X size={20} />
               </button>
             </div>
             
             <p className="text-gray-500 font-medium mb-6">
               Are you sure you want to <strong>{actionType}</strong> <span className="text-[#1B254B] font-bold">{selectedVendor?.name}</span>?
             </p>

             {actionType === 'suspend' && (
               <div className="mb-6">
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Reason for Suspension</label>
                 <textarea 
                   value={suspendReason}
                   onChange={(e) => setSuspendReason(e.target.value)}
                   className="w-full h-24 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-medium text-[#1B254B]"
                   placeholder="Enter reason..."
                 />
               </div>
             )}

             <div className="flex gap-3">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-50">
                 Cancel
               </button>
               <button 
                 onClick={confirmAction}
                 className={`flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg
                   ${actionType === 'approve' || actionType === 'activate' ? 'bg-green-600 shadow-green-500/30 hover:bg-green-700' : 
                     actionType === 'suspend' ? 'bg-yellow-500 shadow-yellow-500/30 hover:bg-yellow-600' : 
                     'bg-red-600 shadow-red-500/30 hover:bg-red-700'}
                 `}
               >
                 Confirm
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

// Removed internal VendorCard component in favor of inline for access to state
export default VendorList;
