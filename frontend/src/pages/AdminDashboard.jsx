import React, { useEffect, useState, useRef, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import api from '../services/api';
import { io } from 'socket.io-client';

import toast from 'react-hot-toast';

// Sub-components
        import AdminHeader from '../components/admin/AdminHeader';
        import AdminEventTable from '../components/admin/AdminEventTable';
        import AdminPlaceTable from '../components/admin/AdminPlaceTable';
        import AdminMessaging from '../components/admin/AdminMessaging';
        import AdminUserTable from '../components/admin/AdminUserTable';
        import EventFormModal from '../components/admin/EventFormModal';
        import PlaceFormModal from '../components/admin/PlaceFormModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [places, setPlaces] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [activeMessageSubTab, setActiveMessageSubTab] = useState('chats');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
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
    location: '', image: '', latitude: '', longitude: '',
    bookingLink: '', chatEnabled: false
  });

  const [placeFormData, setPlaceFormData] = useState({
    name: '', district: '', description: '', image: '', category: 'other'
  });

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/admin'); 
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/admin/users');
      setUsers(response.data.data);
    } catch (err) {
      console.error('Users fetch error:', err);
    } finally {
      if (activeTab === 'users') setLoading(false);
    }
  };

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const token = localStorage.getItem('token');
    socketRef.current = io(API_URL.replace('/api/v1', ''), {
      auth: { token }
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join_room', { userId: 'admin', eventId: 'global' });
      socketRef.current.emit('admin_join');
    });

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
      if (activeMessageSubTab === 'chats' || activeMessageSubTab === 'support') {
        fetchMessages();
        if (activeMessageSubTab === 'support') {
          setSelectedEventId('support');
        } else if (selectedEventId === 'support') {
          setSelectedEventId(null);
        }
      } else {
        fetchContactMessages();
      }
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, activeMessageSubTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedEventId]);

  const activeEventUsers = useMemo(() => {
    if (!selectedEventId) return [];
    
    let filteredMessages;
    if (selectedEventId === 'support') {
      filteredMessages = messages.filter(m => m.room === 'support');
    } else {
      filteredMessages = messages.filter(m => (m.event?._id === selectedEventId || m.event === selectedEventId) && m.room !== 'support');
    }

    const usersMap = new Map();
    
    filteredMessages.forEach(m => {
      const isUser = !m.senderName.toLowerCase().includes('admin');
      const userId = isUser ? m.sender : m.recipient;
      
      if (userId && !usersMap.has(userId)) {
        usersMap.set(userId, {
          id: userId,
          name: isUser ? m.senderName : 'User',
          lastMessage: m
        });
      }
    });
    return Array.from(usersMap.values()).sort((a,b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
  }, [messages, selectedEventId]);

  const eventThreads = useMemo(() => {
    const threads = [];
    
    // Add Support Thread if messages exist
    if (messages.some(m => m.room === 'support')) {
      threads.push({
        eventId: 'support',
        eventTitle: 'Heritage Support',
        lastMessage: messages.find(m => m.room === 'support'),
        unreadCount: 0
      });
    }

    // Add Event Threads
    const uniqueEventIds = Array.from(new Set(messages
      .filter(m => (m.event?._id || m.event) && m.room !== 'support')
      .map(m => m.event?._id || m.event)
    ));

    uniqueEventIds.forEach(eventId => {
      const threadMessages = messages.filter(m => (m.event?._id || m.event) === eventId);
      threads.push({
        eventId,
        eventTitle: threadMessages[0].event?.title || 'Event Channel',
        lastMessage: threadMessages[0],
        unreadCount: 0
      });
    });

    return threads;
  }, [messages]);

  const handleStatusUpdate = async (id, status) => {
     try {
       await api.put(`/events/${id}`, { status });
       setEvents(events.map(ev => ev._id === id ? { ...ev, status } : ev));
       toast.success(`Legend status updated to ${status}`, {
         style: { borderRadius: '1rem', background: '#064e3b', color: '#fbbf24' }
       });
     } catch {
       toast.error('Failed to update ritual status');
     }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
     try {
       await api.delete(`/events/${id}`);
       setEvents(events.filter(ev => ev._id !== id));
       toast.success('Event purged from chronicles');
     } catch {
       toast.error('Failed to delete event');
     }
  };

  const [editingEventId, setEditingEventId] = useState(null);

  const handleEditClick = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      district: event.district,
      date: event.date.split('T')[0],
      location: event.location,
      image: event.image,
      latitude: event.latitude || '',
      longitude: event.longitude || '',
      bookingLink: event.bookingLink || '',
      chatEnabled: event.chatEnabled || false
    });
    setEditingEventId(event._id);
    setShowAddModal(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.image) return toast.error('Please upload an image first');
    
    try {
      if (editingEventId) {
        // Update existing event
        const response = await api.put(`/events/${editingEventId}/edit`, formData);
        setEvents(events.map(ev => ev._id === editingEventId ? response.data.data : ev));
        toast.success('Chronicle updated successfully');
      } else {
        // Create new event
        const response = await api.post('/events', { ...formData, status: 'approved' });
        setEvents([response.data.data, ...events]);
        toast.success('New legend published successfully');
      }
      
      setShowAddModal(false);
      setEditingEventId(null);
      setFormData({ title: '', description: '', district: '', date: '', location: '', image: '', latitude: '', longitude: '', bookingLink: '', chatEnabled: false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleCreatePlace = async (e) => {
    e.preventDefault();
    if (!placeFormData.image) return toast.error('Please upload an image first');
    try {
      const response = await api.post('/places', placeFormData);
      setPlaces([response.data.data, ...places]);
      setShowAddPlaceModal(false);
      setPlaceFormData({ name: '', district: '', description: '', image: '', category: 'other' });
      toast.success('Sacred place added to map');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create place.');
    }
  };

  const handleDeletePlace = async (id) => {
     if (!window.confirm('Are you sure?')) return;
     try {
       await api.delete(`/places/${id}`);
       setPlaces(places.filter(p => p._id !== id));
       toast.success('Sanctuary removed from records');
     } catch {
       toast.error('Failed to delete place');
     }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    try {
      const room = selectedEventId === 'support' ? 'support' : 'global';
      
      await api.post('/messages', {
        event: selectedEventId === 'support' ? null : selectedEventId,
        content: replyMessage,
        senderName: 'LiveKeralam Admin',
        recipientId: selectedUserId,
        room
      });
      setReplyMessage('');
      toast.success('Message sent to explorer');
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  const handleReplyContact = async (id, reply) => {
     try {
       await api.put(`/contact/${id}/reply`, { reply });
       fetchContactMessages();
       toast.success('Response sent successfully');
     } catch {
       toast.error('Failed to send inquiry response');
     }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AdminHeader 
          activeTab={activeTab} setActiveTab={setActiveTab}
          activeMessageSubTab={activeMessageSubTab} setActiveMessageSubTab={setActiveMessageSubTab}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onAddClick={() => activeTab === 'events' ? setShowAddModal(true) : setShowAddPlaceModal(true)}
        />

        <EventFormModal 
          show={showAddModal} onClose={() => {
            setShowAddModal(false);
            setShowAddModal(false);
            setEditingEventId(null);
            setFormData({ title: '', description: '', district: '', date: '', location: '', image: '', latitude: '', longitude: '', bookingLink: '', chatEnabled: false });
          }}
          formData={formData} setFormData={setFormData} onSubmit={handleCreateEvent}
          isEdit={!!editingEventId}
        />

        <PlaceFormModal 
          show={showAddPlaceModal} onClose={() => setShowAddPlaceModal(false)}
          formData={placeFormData} setFormData={setPlaceFormData} onSubmit={handleCreatePlace}
        />

        {activeTab === 'events' && (
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
            <AdminEventTable 
              events={filteredEvents} 
              onStatusUpdate={handleStatusUpdate} 
              onDelete={handleDeleteEvent} 
              onEdit={handleEditClick}
            />
          </div>
        )}

        {activeTab === 'places' && (
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
            <AdminPlaceTable places={places} searchTerm={searchTerm} onDelete={handleDeletePlace} />
          </div>
        )}

        {activeTab === 'messages' && (
          <AdminMessaging 
            messages={messages} contactMessages={contactMessages}
            activeMessageSubTab={activeMessageSubTab} searchTerm={searchTerm}
            selectedEventId={selectedEventId} setSelectedEventId={setSelectedEventId}
            selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId}
            replyMessage={replyMessage} setReplyMessage={setReplyMessage}
            onSendMessage={handleSendMessage} onReplyContact={handleReplyContact}
            eventThreads={eventThreads} activeEventUsers={activeEventUsers}
            messagesEndRef={messagesEndRef} loading={loading}
          />
        )}
        
        {activeTab === 'users' && (
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
            <AdminUserTable users={users.filter(u => 
              u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              u.email.toLowerCase().includes(searchTerm.toLowerCase())
            )} />
          </div>
        )}
        
        {((activeTab === 'events' && filteredEvents.length === 0) || 
          (activeTab === 'places' && places.length === 0) || 
          (activeTab === 'users' && users.length === 0) || 
          (activeTab === 'messages' && activeMessageSubTab === 'chats' && messages.length === 0) || 
          (activeTab === 'messages' && activeMessageSubTab === 'inquiries' && contactMessages.length === 0)) && !loading && (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-gray-200" />
            <p className="text-gray-400 font-bold font-display text-xl">No {activeTab} discovered matching your search.</p>
            <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="text-emerald-900 font-black text-xs uppercase tracking-widest border-b-2 border-emerald-100">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
