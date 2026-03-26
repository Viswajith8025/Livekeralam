import React, { useEffect, useState, useRef } from 'react';
import { 
  CheckCircle, XCircle, Clock, LayoutDashboard, Settings, 
  Users, Calendar, Plus, X, Search, Filter, Trash2, AlertCircle, MapPin, MessageSquare, Send
} from 'lucide-react';
import api from '../services/api';
import { io } from 'socket.io-client';
import ImageUpload from '../components/ImageUpload';
import { KERALA_DISTRICTS } from '../utils/constants';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [places, setPlaces] = useState([]);
  const [messages, setMessages] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [activeMessageSubTab, setActiveMessageSubTab] = useState('chats');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', district: '', date: '', 
    location: '', image: '', latitude: '', longitude: ''
  });

  const [placeFormData, setPlaceFormData] = useState({
    name: '', district: '', description: '', image: '', category: 'other'
  });

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events'); 
      setEvents(response.data.data);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      if (activeTab === 'events') setLoading(false);
    }
  };

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/places');
      setPlaces(response.data.data);
    } catch (err) {
      console.error('Place fetch error:', err);
    } finally {
      if (activeTab === 'places') setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages');
      setMessages(response.data.data);
    } catch (err) {
      console.error('Messages fetch error:', err);
    } finally {
      if (activeTab === 'messages' && activeMessageSubTab === 'chats') setLoading(false);
    }
  };

  const fetchContactMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contact');
      setContactMessages(response.data.data || []);
    } catch (err) {
      console.error('Contact fetch error:', err);
    } finally {
      if (activeTab === 'messages' && activeMessageSubTab === 'inquiries') setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize Socket
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    socketRef.current = io(API_URL.replace('/api/v1', ''));

    socketRef.current.on('receive_message', (data) => {
      setMessages((prev) => [data, ...prev]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      socketRef.current.emit('join_room', selectedEventId);
    }
  }, [selectedEventId]);

  useEffect(() => {
    if (activeTab === 'events') {
      fetchAllEvents();
    } else if (activeTab === 'places') {
      fetchPlaces();
    } else if (activeTab === 'messages') {
      if (activeMessageSubTab === 'chats') {
        fetchMessages();
      } else {
        fetchContactMessages();
      }
    }
  }, [activeTab, activeMessageSubTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedEventId]);

  // Group messages by event for the sidebar
  const eventThreads = Array.from(new Set(messages
    .filter(m => m.event?._id)
    .map(m => m.event._id)
  )).map(eventId => {
    const threadMessages = messages.filter(m => m.event?._id === eventId);
    return {
      eventId,
      eventTitle: threadMessages[0].event.title,
      lastMessage: threadMessages[0],
      unreadCount: 0 // Placeholder
    };
  });

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/events/${id}`, { status });
      setEvents(events.map(ev => ev._id === id ? { ...ev, status } : ev));
    } catch (err) {
      alert('Failed to update status. Admin permission required.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(ev => ev._id !== id));
      alert('Event deleted successfully');
    } catch (err) {
      alert('Failed to delete event.');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert('Please upload an image first');
    
    try {
      const response = await api.post('/events', {
        ...formData,
        latitude: parseFloat(formData.latitude) || undefined,
        longitude: parseFloat(formData.longitude) || undefined,
        status: 'approved' 
      });
      
      setEvents([response.data.data, ...events]);
      setShowAddModal(false);
      setFormData({ title: '', description: '', district: '', date: '', location: '', image: '', latitude: '', longitude: '' });
      alert('Event published successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create event. Please check formatting and minimum lengths (Title 5+, Description 20+).';
      alert(errorMsg);
    }
  };

  const handleCreatePlace = async (e) => {
    e.preventDefault();
    if (!placeFormData.image) return alert('Please upload an image first');
    
    try {
      const response = await api.post('/places', placeFormData);
      setPlaces([response.data.data, ...places]);
      setShowAddPlaceModal(false);
      setPlaceFormData({ name: '', district: '', description: '', image: '', category: 'other' });
      alert('Place added successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create place. Please check formatting and minimum lengths (Name 3+, Description 10+).';
      alert(errorMsg);
    }
  };

  const handleDeletePlace = async (id) => {
    if (!window.confirm('Are you sure you want to delete this heritage place?')) return;
    try {
      await api.delete(`/places/${id}`);
      setPlaces(places.filter(p => p._id !== id));
      alert('Place deleted successfully');
    } catch (err) {
      alert('Failed to delete place.');
    }
  };

  const handleReplyContact = async (id, reply) => {
    try {
      await api.put(`/contact/${id}/reply`, { reply });
      fetchContactMessages();
      alert('Reply sent to user inquiry!');
    } catch (err) {
      alert('Failed to send reply.');
    }
  };

  // Filter & Search Logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-gray-900 font-display flex items-center gap-3">
                <LayoutDashboard className="text-indigo-600 w-10 h-10" />
                Command Center
              </h1>
              <p className="text-gray-500 font-medium">Moderating God's Own Country, managing {activeTab === 'events' ? 'events' : activeTab === 'places' ? 'heritage sites' : 'community chat'}.</p>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl w-fit border border-gray-100">
              <button 
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'events' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-4 h-4" /> Events
              </button>
              <button 
                onClick={() => setActiveTab('places')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'places' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                <MapPin className="w-4 h-4" /> Heritage Places
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Inbox
              </button>
            </div>
            
            {/* Sub-tabs for Messages */}
            {activeTab === 'messages' && (
              <div className="flex items-center gap-4 mt-4">
                <button 
                  onClick={() => setActiveMessageSubTab('chats')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeMessageSubTab === 'chats' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-gray-400'
                  }`}
                >
                  Event Chats
                </button>
                <button 
                  onClick={() => setActiveMessageSubTab('inquiries')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeMessageSubTab === 'inquiries' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-gray-400'
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
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all"
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
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      statusFilter === status 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                   >
                     {status}
                   </button>
                 ))}
              </div>
            )}

            <button 
              onClick={() => activeTab === 'events' ? setShowAddModal(true) : setShowAddPlaceModal(true)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-5 h-5" /> Add {activeTab === 'events' ? 'Event' : 'Heritage Place'}
            </button>
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl">
               <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-10 py-8 border-b border-gray-100 flex items-center justify-between">
                 <h2 className="text-3xl font-black font-display text-gray-900">Create New Event</h2>
                 <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                   <X className="w-6 h-6 text-gray-400" />
                 </button>
               </div>
               
               <form onSubmit={handleCreateEvent} className="p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <ImageUpload onUploadSuccess={(url) => setFormData({...formData, image: url})} />
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Latitude</label>
                           <input 
                             type="number" step="any" placeholder="9.9312"
                             className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                             value={formData.latitude}
                             onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                           />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Longitude</label>
                           <input 
                             type="number" step="any" placeholder="76.2673"
                             className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                             value={formData.longitude}
                             onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                           />
                         </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</label>
                        <input 
                          type="text" required placeholder="Ex: Kochi Music Festival"
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-black text-gray-900 focus:ring-2 focus:ring-indigo-100"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                          <select 
                            required
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                            value={formData.district}
                            onChange={(e) => setFormData({...formData, district: e.target.value})}
                          >
                            <option value="">Select District</option>
                            {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                          <input 
                            type="date" required
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specific Location</label>
                        <input 
                          type="text" required placeholder="Ex: Marine Drive, Kochi"
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea 
                          required rows="5" placeholder="Tell us about the event..."
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="pt-10 border-t border-gray-100 flex justify-end gap-6">
                    <button type="button" onClick={() => setShowAddModal(false)} className="px-8 py-4 font-bold text-gray-400 hover:text-gray-900 transition-all">Cancel</button>
                    <button type="submit" className="px-14 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95">Publish Event</button>
                  </div>
               </form>
            </div>
          </div>
        )}

        {/* Add Heritage Place Modal */}
        {showAddPlaceModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowAddPlaceModal(false)}></div>
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl">
               <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-10 py-8 border-b border-gray-100 flex items-center justify-between">
                 <h2 className="text-3xl font-black font-display text-gray-900">Add Heritage Place</h2>
                 <button onClick={() => setShowAddPlaceModal(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                   <X className="w-6 h-6 text-gray-400" />
                 </button>
               </div>
               
               <form onSubmit={handleCreatePlace} className="p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <ImageUpload onUploadSuccess={(url) => setPlaceFormData({...placeFormData, image: url})} />
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                          <select 
                            required
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                            value={placeFormData.category}
                            onChange={(e) => setPlaceFormData({...placeFormData, category: e.target.value})}
                          >
                            {['Beach', 'Hill Station', 'Backwater', 'Waterfall', 'Heritage', 'Temple', 'Spiritual', 'Nature', 'other'].map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Place Name</label>
                        <input 
                          type="text" required placeholder="Ex: Mattancherry Palace"
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-black text-gray-900 focus:ring-2 focus:ring-indigo-100"
                          value={placeFormData.name}
                          onChange={(e) => setPlaceFormData({...placeFormData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                        <select 
                          required
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                          value={placeFormData.district}
                          onChange={(e) => setPlaceFormData({...placeFormData, district: e.target.value})}
                        >
                          <option value="">Select District</option>
                          {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea 
                          required rows="6" placeholder="Describe the heritage and significance..."
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100"
                          value={placeFormData.description}
                          onChange={(e) => setPlaceFormData({...placeFormData, description: e.target.value})}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="pt-10 border-t border-gray-100 flex justify-end gap-6">
                    <button type="button" onClick={() => setShowAddPlaceModal(false)} className="px-8 py-4 font-bold text-gray-400 hover:text-gray-900 transition-all">Cancel</button>
                    <button type="submit" className="px-14 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100">Save Heritage Place</button>
                  </div>
               </form>
            </div>
          </div>
        )}

        {/* Data Table Container */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'events' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Identification</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Region</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Current Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-indigo-50/30 transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <img src={event.image} alt="" className="w-16 h-16 rounded-[1.2rem] object-cover shadow-lg" />
                            <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center ${
                              event.status === 'approved' ? 'bg-green-500' : 
                              event.status === 'pending' ? 'bg-amber-500' : 
                              event.status === 'finished' ? 'bg-slate-400' : 'bg-red-500'
                            }`}></div>
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-lg font-display tracking-tight">{event.title}</p>
                            <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5 mt-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(event.date).toDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="inline-flex items-center px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          {event.district}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          event.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          event.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          event.status === 'finished' ? 'bg-slate-100 text-slate-600' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {event.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(event._id, 'approved')}
                                className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                title="Approve"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(event._id, 'rejected')}
                                className="p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          
                          {event.status === 'approved' && (
                            <button 
                              onClick={() => handleStatusUpdate(event._id, 'finished')}
                              className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                              title="Mark as Finished"
                            >
                              Finish
                            </button>
                          )}

                          <button 
                            onClick={() => handleStatusUpdate(event._id, 'pending')}
                            className="px-4 py-2 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Reset
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Permanently Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === 'places' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Heritage Place</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">District</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Category</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {places.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.district.toLowerCase().includes(searchTerm.toLowerCase())).map((place) => (
                    <tr key={place._id} className="hover:bg-indigo-50/30 transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <img src={place.image} alt="" className="w-16 h-16 rounded-[1.2rem] object-cover shadow-lg" />
                          <div>
                            <p className="font-black text-gray-900 text-lg font-display tracking-tight">{place.name}</p>
                            <p className="text-xs text-gray-400 font-medium line-clamp-1 max-w-sm italic mt-1">{place.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="inline-flex items-center px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          {place.district}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className="inline-flex items-center px-4 py-1.5 bg-gold-50 text-gold-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {place.category}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => handleDeletePlace(place._id)}
                          className="p-3 bg-red-50 text-red-600 rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Delete Heritage Place"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeMessageSubTab === 'chats' ? (
              <div className="flex bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl h-[650px]">
                {/* Conversations Sidebar */}
                <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/30">
                  <div className="p-6 border-b border-gray-100 bg-white">
                    <h3 className="font-black text-gray-900 font-display flex items-center gap-2">
                       <MessageSquare className="w-4 h-4 text-indigo-600" />
                       Event Channels
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {eventThreads.length === 0 ? (
                      <div className="p-10 text-center opacity-30">
                        <p className="text-xs font-bold uppercase tracking-widest">No active threads</p>
                      </div>
                    ) : (
                      eventThreads.map(thread => (
                        <button 
                          key={thread.eventId}
                          onClick={() => setSelectedEventId(thread.eventId)}
                          className={`w-full p-6 text-left flex items-start gap-4 transition-all hover:bg-white border-b border-gray-100/50 ${selectedEventId === thread.eventId ? 'bg-white ring-1 ring-inset ring-indigo-500/10 border-l-4 border-l-indigo-600' : ''}`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shrink-0">
                            {thread.eventTitle[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-black text-gray-900 text-sm truncate">{thread.eventTitle}</h4>
                              <span className="text-[8px] font-black text-gray-400 uppercase">{new Date(thread.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1 font-medium">{thread.lastMessage.content}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-white">
                  {selectedEventId ? (
                    <>
                      {/* Thread Header */}
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                           {eventThreads.find(t => t.eventId === selectedEventId)?.eventTitle[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900">{eventThreads.find(t => t.eventId === selectedEventId)?.eventTitle}</h4>
                            <p className="text-[8px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live Channel
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/20">
                        {messages.filter(m => m.event?._id === selectedEventId).slice().reverse().map((msg, idx) => (
                          <div key={msg._id || idx} className={`flex flex-col ${msg.senderName.includes('Admin') ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-2 mb-1.5 px-1">
                              <span className={`text-[10px] font-black uppercase tracking-tighter ${msg.senderName.includes('Admin') ? 'text-indigo-600' : 'text-gray-400'}`}>
                                {msg.senderName}
                                {msg.senderName.includes('Admin') && <span className="ml-1.5 bg-indigo-600 text-white px-1.5 py-0.5 rounded-full text-[8px]">OFFICIAL</span>}
                              </span>
                            </div>
                            <div className={`max-w-[75%] px-6 py-4 rounded-[1.5rem] text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                              msg.senderName.includes('Admin') 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                            }`}>
                              {msg.content}
                            </div>
                            <span className="text-[8px] font-black text-gray-300 mt-2 px-2 uppercase italic">
                              {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input Area */}
                      <div className="p-6 bg-white border-t border-gray-100">
                        <form 
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!replyMessage.trim()) return;
                            try {
                              const response = await api.post('/messages', {
                                event: selectedEventId,
                                content: `${replyMessage}`,
                                senderName: 'LiveKeralam Admin'
                              });
                              // The socket listener handles adding to local state
                              setReplyMessage('');
                            } catch (err) {
                              alert('Failed to send reply');
                            }
                          }}
                          className="relative flex items-center"
                        >
                          <input 
                            type="text"
                            placeholder="Type a message..."
                            className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 rounded-2xl px-6 py-4 pr-16 text-sm font-medium transition-all"
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                          />
                          <button 
                            type="submit"
                            className="absolute right-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
                      <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-10 h-10 text-indigo-300" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 font-display">Messenger Control</h3>
                        <p className="text-gray-400 font-medium max-w-xs mx-auto mt-2 italic">Select a community thread on the left to start moderating live discussions.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inquirer</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Requirement</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {contactMessages.filter(m => 
                    (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                    (m.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (m.message || '').toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((contact) => (
                    <tr key={contact._id} className="hover:bg-indigo-50/30 transition-all group">
                      <td className="px-10 py-8">
                        <div>
                          <p className="font-black text-gray-900">{contact.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{contact.email}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="font-bold text-gray-600 text-sm">{contact.subject}</span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-4">
                          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-md">{contact.message}</p>
                          {contact.adminReply && (
                            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                              <p className="text-[8px] font-black text-amber-600 uppercase mb-1">Your Reply</p>
                              <p className="text-xs text-amber-900 font-medium">{contact.adminReply}</p>
                            </div>
                          )}
                          <div className="opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            <button 
                              onClick={() => {
                                const reply = prompt(`Reply to ${contact.name} (${contact.email}):`);
                                if (reply) handleReplyContact(contact._id, reply);
                              }}
                              className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100/50 flex items-center gap-2"
                            >
                              <Plus className="w-3 h-3" /> Send Inquiry Reply
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          contact.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {contact.status}
                        </span>
                        <p className="text-[8px] text-gray-300 mt-2">{new Date(contact.createdAt).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {((activeTab === 'events' && filteredEvents.length === 0) || (activeTab === 'places' && places.length === 0) || (activeTab === 'messages' && activeMessageSubTab === 'chats' && messages.length === 0) || (activeTab === 'messages' && activeMessageSubTab === 'inquiries' && contactMessages.length === 0)) && !loading && (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
                <AlertCircle className="w-16 h-16 text-gray-200" />
                <p className="text-gray-400 font-bold font-display text-xl">No {activeTab} discovered matching your search.</p>
                <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="text-indigo-600 font-black text-xs uppercase tracking-widest border-b-2 border-indigo-100">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
