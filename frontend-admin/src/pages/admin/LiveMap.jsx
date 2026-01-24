import React, { useState } from 'react';
import { MapPin, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const LiveMap = () => {
  const [activeVendorCount, setActiveVendorCount] = useState(124);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1B254B]">Live Vendor Map</h2>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-sm font-bold text-green-600 uppercase tracking-wider">{activeVendorCount} Online Now</span>
          </div>
        </div>
        
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30">
             Refresh Data
           </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden relative group">
        {/* Placeholder for actual Map integration (Google Maps / Leaflet) */}
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-74.006,40.7128,12,0/1200x800?access_token=YOUR_TOKEN')] bg-cover bg-center grayscale-[0.2]" />
        
        {/* Mock Pins */}
        <div className="absolute top-1/2 left-1/2 -translate-x-10 -translate-y-20">
          <MapPinButton name="Gourmet Burger" status="active" />
        </div>
        <div className="absolute top-1/3 left-1/3">
          <MapPinButton name="Fresh Fruits" status="active" />
        </div>
         <div className="absolute bottom-1/3 right-1/4">
          <MapPinButton name="Tech World" status="offline" />
        </div>
        
        {/* Legend Overlay */}
        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50">
           <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Legend</h4>
           <div className="space-y-2">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
               <span className="w-2 h-2 rounded-full bg-green-500" /> Active (32)
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
               <span className="w-2 h-2 rounded-full bg-yellow-400" /> Idle (8)
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
               <span className="w-2 h-2 rounded-full bg-red-400" /> Offline (5)
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MapPinButton = ({ name, status }) => (
  <div className="group relative">
    <button className={`p-2 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 ${
      status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-100'
    }`}>
      <MapPin size={24} fill="currentColor" />
    </button>
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-[#1B254B] text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {name}
    </div>
  </div>
);

export default LiveMap;
