import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  // Replace with the actual phone number
  const phoneNumber = '914712345678'; 
  const message = 'Hello LiveKeralam! I would like to partner with you or publish an event.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 group"
    >
      <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/40 transition-all duration-500 animate-pulse"></div>
      <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl shadow-emerald-950/20 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
        <MessageCircle className="w-8 h-8 fill-current" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-950 text-gold-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-gold-500/30 backdrop-blur-md">
          Connect with Us
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
