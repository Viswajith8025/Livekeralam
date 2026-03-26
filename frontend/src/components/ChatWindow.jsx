import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, User as UserIcon, Loader2 } from 'lucide-react';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'https://eventkerala-backend-sfup.onrender.com/api/v1';

const ChatWindow = ({ eventId, eventTitle }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch message history
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/messages/${eventId}`);
        setMessages(response.data.data);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    // Initialize Socket
    socketRef.current = io(API_URL.replace('/api/v1', ''));

    socketRef.current.emit('join_room', eventId);

    socketRef.current.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [eventId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !token) return;

    const messageData = {
      eventId,
      content: newMessage,
      senderName: user.name || 'Anonymous',
      senderId: user.id,
      createdAt: new Date()
    };

    // Emit real-time
    socketRef.current.emit('send_message', messageData);

    // Save to DB
    try {
      await api.post('/messages', {
        event: eventId,
        content: newMessage,
        senderName: user.name || 'Anonymous'
      });
    } catch (err) {
      console.error('Error saving message:', err);
    }

    setNewMessage('');
  };

  if (!token) {
    return (
      <div className="bg-gray-50 rounded-3xl p-8 text-center border-2 border-dashed border-gray-200">
        <p className="text-gray-500 font-medium">Please login to join the discussion.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-indigo-600 text-white">
        <h3 className="text-lg font-bold font-display flex items-center gap-2">
          Organised Chat: {eventTitle}
        </h3>
        <p className="text-xs text-indigo-100 mt-1">Connect with the community and organizers</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 opacity-40">
            <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.senderName === user.name ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${msg.senderName.includes('Admin') ? 'text-amber-600' : 'text-gray-400'}`}>
                  {msg.senderName}
                  {msg.senderName.includes('Admin') && <span className="ml-1 bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[8px]">OFFICIAL</span>}
                </span>
              </div>
              <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm font-medium shadow-sm ${
                msg.senderName === user.name
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : msg.senderName.includes('Admin')
                    ? 'bg-amber-50 text-emerald-950 border-2 border-amber-500/20 rounded-tl-none font-bold'
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                {msg.content}
              </div>
              <span className="text-[8px] text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-100 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 pr-16 text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
