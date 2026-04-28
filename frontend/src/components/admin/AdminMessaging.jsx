import React from 'react';
import { MessageSquare, Users, Send, AlertCircle, Plus, ShieldCheck } from 'lucide-react';

const AdminMessaging = ({ 
  messages, 
  contactMessages, 
  activeMessageSubTab, 
  searchTerm,
  selectedEventId,
  setSelectedEventId,
  selectedUserId,
  setSelectedUserId,
  replyMessage,
  setReplyMessage,
  onSendMessage,
  onReplyContact,
  eventThreads,
  activeEventUsers,
  messagesEndRef,
  loading
}) => {
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100 overflow-hidden">
      {(activeMessageSubTab === 'chats' || activeMessageSubTab === 'support') ? (
        <div className="flex bg-white h-[650px]">
          {/* Conversations Sidebar */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/30">
            <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
              <h3 className="font-black text-gray-900 font-display flex items-center gap-2">
                 <MessageSquare className="w-4 h-4 text-emerald-900" />
                 {activeMessageSubTab === 'support' ? 'Support Threads' : (selectedEventId ? 'User Threads' : 'Event Channels')}
              </h3>
              {(selectedEventId && activeMessageSubTab === 'chats') && (
                <button 
                  onClick={() => { setSelectedEventId(null); setSelectedUserId(null); }}
                  className="text-xs font-black text-emerald-900 uppercase tracking-widest hover:underline"
                >
                  All Channels
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeMessageSubTab === 'support' ? (
                // Support Specific Logic
                eventThreads.filter(t => t.eventId === 'support').length === 0 ? (
                  <div className="p-10 text-center opacity-30">
                    <p className="text-xs font-bold uppercase tracking-widest">No active support threads</p>
                  </div>
                ) : (
                  // For support, we go straight to users list for the 'support' virtual event
                  activeEventUsers.length === 0 && selectedEventId !== 'support' ? (
                    // If support selectedEventId is not set, set it automatically if support threads exist
                    <div className="p-10 text-center">
                       <button 
                        onClick={() => setSelectedEventId('support')}
                        className="text-xs font-black text-emerald-900 underline uppercase tracking-widest"
                       >
                         Initialize Support Line
                       </button>
                    </div>
                  ) : (
                    activeEventUsers.map(userThread => (
                      <button 
                        key={userThread.id}
                        onClick={() => setSelectedUserId(userThread.id)}
                        className={`w-full p-6 text-left flex items-start gap-4 transition-all hover:bg-white border-b border-gray-100/50 ${selectedUserId === userThread.id ? 'bg-white border-l-4 border-l-emerald-900' : ''}`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900 font-black text-xs shrink-0">
                           <Users className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-gray-900 text-sm truncate">{userThread.name}</h4>
                            <span className="text-[8px] font-black text-gray-400 uppercase">{new Date(userThread.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1 font-medium">{userThread.lastMessage.content}</p>
                        </div>
                      </button>
                    ))
                  )
                )
              ) : (
                // Event Chats Logic
                !selectedEventId ? (
                  eventThreads.filter(t => t.eventId !== 'support').length === 0 ? (
                    <div className="p-10 text-center opacity-30">
                      <p className="text-xs font-bold uppercase tracking-widest">No active channels</p>
                    </div>
                  ) : (
                    eventThreads.filter(t => t.eventId !== 'support').map(thread => (
                      <button 
                        key={thread.eventId}
                        onClick={() => setSelectedEventId(thread.eventId)}
                        className={`w-full p-6 text-left flex items-start gap-4 transition-all hover:bg-white border-b border-gray-100/50 ${selectedEventId === thread.eventId ? 'bg-white border-l-4 border-l-emerald-900' : ''}`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-900 font-black text-xs shrink-0">
                           {thread.eventTitle[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-gray-900 text-sm truncate">{thread.eventTitle}</h4>
                          </div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Click to see users</p>
                        </div>
                      </button>
                    ))
                  )
                ) : (
                  activeEventUsers.length === 0 ? (
                    <div className="p-10 text-center opacity-30">
                      <p className="text-xs font-bold uppercase tracking-widest">No user threads</p>
                    </div>
                  ) : (
                    activeEventUsers.map(userThread => (
                      <button 
                        key={userThread.id}
                        onClick={() => setSelectedUserId(userThread.id)}
                        className={`w-full p-6 text-left flex items-start gap-4 transition-all hover:bg-white border-b border-gray-100/50 ${selectedUserId === userThread.id ? 'bg-white border-l-4 border-l-emerald-900' : ''}`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900 font-black text-xs shrink-0">
                           <Users className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-gray-900 text-sm truncate">{userThread.name}</h4>
                            <span className="text-[8px] font-black text-gray-400 uppercase">{new Date(userThread.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1 font-medium">{userThread.lastMessage.content}</p>
                        </div>
                      </button>
                    ))
                  )
                )
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedUserId ? (
              <>
                {/* Thread Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-white font-black text-xs">
                       {selectedEventId === 'support' ? <ShieldCheck className="w-5 h-5 text-gold-500" /> : <Users className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">{activeEventUsers.find(u => u.id === selectedUserId)?.name || 'Private Chat'}</h4>
                      <p className="text-[8px] text-emerald-800 font-black uppercase tracking-widest flex items-center gap-1">
                         {selectedEventId === 'support' ? (
                           <>
                             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                             Secure Heritage Support Line
                           </>
                         ) : (
                           `Thread on: ${eventThreads.find(t => t.eventId === selectedEventId)?.eventTitle}`
                         )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/20">
                  {messages.filter(m => {
                    if (selectedEventId === 'support') {
                      return m.room === 'support' && (m.sender === selectedUserId || m.recipient === selectedUserId);
                    }
                    return (m.event?._id === selectedEventId || m.event === selectedEventId) && 
                           (m.sender === selectedUserId || m.recipient === selectedUserId || (m.senderName.toLowerCase().includes('admin') && m.recipient === selectedUserId));
                  }).slice().reverse().map((msg, idx) => (
                    <div key={msg._id || idx} className={`flex flex-col ${msg.senderName.toLowerCase().includes('admin') ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1.5 px-1">
                        <span className={`text-xs font-black uppercase tracking-tighter ${msg.senderName.toLowerCase().includes('admin') ? 'text-emerald-900' : 'text-gray-400'}`}>
                          {msg.senderName}
                          {msg.senderName.toLowerCase().includes('admin') && <span className="ml-1.5 bg-emerald-900 text-white px-1.5 py-0.5 rounded-full text-[8px]">OFFICIAL</span>}
                        </span>
                      </div>
                      <div className={`max-w-[75%] px-6 py-4 rounded-[1.5rem] text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                        msg.senderName.toLowerCase().includes('admin') 
                          ? 'bg-emerald-900 text-white rounded-tr-none shadow-emerald-900/10' 
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
                  <form onSubmit={onSendMessage} className="relative flex items-center">
                    <input 
                      type="text"
                      placeholder="Type a message..."
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-emerald-900 focus:ring-4 focus:ring-emerald-950/5 rounded-2xl px-6 py-4 pr-16 text-sm font-medium transition-all"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 p-3 bg-emerald-900 text-white rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-300">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 font-display">Messenger Control</h3>
                  <p className="text-gray-400 font-medium max-w-xs mx-auto mt-2 italic">
                    {selectedEventId ? 'Select a user thread on the left to start the private conversation.' : 'Select an event channel on the left to moderate discussions.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Inquirer</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Subject</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Requirement</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contactMessages.filter(m => 
              (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
              (m.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
              (m.message || '').toLowerCase().includes(searchTerm.toLowerCase())
            ).map((contact) => (
              <tr key={contact._id} className="hover:bg-emerald-50/30 transition-all group">
                <td className="px-10 py-8">
                  <div>
                    <p className="font-black text-gray-900">{contact.name}</p>
                    <div className="flex flex-col gap-1 mt-1">
                      <p className="text-[10px] text-emerald-900 font-black uppercase tracking-widest">{contact.phone}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{contact.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="font-bold text-gray-600 text-sm">{contact.subject}</span>
                </td>
                <td className="px-10 py-8">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-md">{contact.message}</p>
                    {contact.adminReply && (
                      <div className="bg-gold-50 p-3 rounded-xl border border-gold-100">
                        <p className="text-[8px] font-black text-gold-600 uppercase mb-1">Your Reply</p>
                        <p className="text-xs text-gold-900 font-medium">{contact.adminReply}</p>
                      </div>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <button 
                        onClick={() => {
                          const reply = prompt(`Reply to ${contact.name} (${contact.email}):`);
                          if (reply) onReplyContact(contact._id, reply);
                        }}
                        className="text-xs font-black uppercase tracking-[0.2em] text-emerald-900 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100/50 flex items-center gap-2"
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
    </div>
  );
};

export default AdminMessaging;
