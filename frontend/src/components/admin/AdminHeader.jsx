import React from 'react';
import { 
  LayoutDashboard, Calendar, MapPin, MessageSquare, Search, Plus, LogOut, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ 
  activeTab, 
  setActiveTab, 
  activeMessageSubTab, 
  setActiveMessageSubTab,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onAddClick
}) => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 font-display flex items-center gap-3">
              <LayoutDashboard className="text-emerald-900 w-10 h-10" />
              Command Center
            </h1>
            <p className="text-gray-500 font-medium">Moderating God's Own Country, managing {activeTab === 'events' ? 'events' : activeTab === 'places' ? 'heritage sites' : 'community chat'}.</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl w-fit border border-gray-100">
          <button 
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'events' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4" /> Events
          </button>
          <button 
            onClick={() => setActiveTab('places')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'places' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-4 h-4" /> Heritage Places
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'messages' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Inbox
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'users' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" /> Community
          </button>
        </div>
        
        {/* Sub-tabs for Messages */}
        {activeTab === 'messages' && (
          <div className="flex items-center gap-4 mt-4">
            <button 
              onClick={() => setActiveMessageSubTab('chats')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeMessageSubTab === 'chats' ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'text-gray-400'
              }`}
            >
              Event Chats
            </button>
            <button 
              onClick={() => setActiveMessageSubTab('support')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeMessageSubTab === 'support' ? 'bg-emerald-950 text-gold-500 border border-emerald-900' : 'text-gray-400'
              }`}
            >
              Support Portal
            </button>
            <button 
              onClick={() => setActiveMessageSubTab('inquiries')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeMessageSubTab === 'inquiries' ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'text-gray-400'
              }`}
            >
              Contact Inquiries
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter (Only for Events) */}
        {activeTab === 'events' && (
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
             {['all', 'pending', 'approved', 'rejected', 'finished'].map((status) => (
               <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  statusFilter === status 
                  ? 'bg-white text-emerald-900 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
                }`}
               >
                 {status}
               </button>
             ))}
          </div>
        )}

        <button 
          onClick={onAddClick}
          className="px-8 py-4 bg-emerald-900 text-white rounded-2xl font-black text-sm hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10 flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add {activeTab === 'events' ? 'Event' : 'Heritage Place'}
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
