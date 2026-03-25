import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Globe, Share2 } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#F9F6F1] pt-32">
      <div className="max-w-7xl mx-auto px-6 py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">

          {/* Contact Info */}
          <div className="space-y-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gold-600">
                <MessageCircle className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Get in Touch</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-display font-medium text-emerald-950 leading-[0.9] tracking-tighter">
                Let's Start a <br /> <span className="italic text-gold-600">Conversation.</span>
              </h1>
              <p className="text-xl text-emerald-900/60 leading-relaxed font-light italic max-w-md">
                Whether you're an organizer, a traveler, or an adventurer, we'd love to hear from you.
              </p>
            </div>

            <div className="space-y-10">
              <div className="flex items-center gap-8 group cursor-pointer">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-xl shadow-emerald-950/5 flex items-center justify-center text-gold-600 group-hover:bg-gold-600 group-hover:text-white transition-all duration-500 border border-emerald-900/5">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 mb-1">Email Us</p>
                  <p className="text-lg font-bold text-emerald-950">hello@livekeralam.com</p>
                </div>
              </div>

              <div className="flex items-center gap-8 group cursor-pointer">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-xl shadow-emerald-950/5 flex items-center justify-center text-gold-600 group-hover:bg-gold-600 group-hover:text-white transition-all duration-500 border border-emerald-900/5">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 mb-1">Call Us</p>
                  <p className="text-lg font-bold text-emerald-950">+91 7736958025</p>
                </div>
              </div>

              <div className="flex items-center gap-8 group cursor-pointer">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-xl shadow-emerald-950/5 flex items-center justify-center text-gold-600 group-hover:bg-gold-600 group-hover:text-white transition-all duration-500 border border-emerald-900/5">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 mb-1">Visit Us</p>
                  <p className="text-lg font-bold text-emerald-950">Kozhikode, Kerala, India</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-10 space-y-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 italic">Follow our journey</p>
              <div className="flex gap-6">
                <a href="#" className="w-12 h-12 rounded-full border border-emerald-950/10 flex items-center justify-center hover:bg-emerald-950 hover:text-white transition-all duration-500">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-emerald-950/10 flex items-center justify-center hover:bg-emerald-950 hover:text-white transition-all duration-500">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-emerald-950/10 flex items-center justify-center hover:bg-emerald-950 hover:text-white transition-all duration-500">
                  <Share2 className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl shadow-emerald-950/5 border border-emerald-900/5 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

            <form className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-1">Full Name</label>
                  <input type="text" className="w-full bg-emerald-900/5 border-transparent focus:bg-white focus:border-emerald-950 focus:ring-4 focus:ring-emerald-950/5 rounded-2xl py-4 px-6 transition-all text-emerald-950 font-medium" placeholder="Aromal S." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-1">Email</label>
                  <input type="email" className="w-full bg-emerald-900/5 border-transparent focus:bg-white focus:border-emerald-950 focus:ring-4 focus:ring-emerald-950/5 rounded-2xl py-4 px-6 transition-all text-emerald-950 font-medium" placeholder="aromal@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-1">Subject</label>
                <select className="w-full bg-emerald-900/5 border-transparent focus:bg-white focus:border-emerald-950 focus:ring-4 focus:ring-emerald-950/5 rounded-2xl py-4 px-6 transition-all text-emerald-950 font-medium appearance-none">
                  <option>Plan a Trip</option>
                  <option>Partner with Us</option>
                  <option>Publish an Event</option>
                  <option>General Inquiry</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-1">Message</label>
                <textarea rows="5" className="w-full bg-emerald-900/5 border-transparent focus:bg-white focus:border-emerald-950 focus:ring-4 focus:ring-emerald-950/5 rounded-[2rem] py-4 px-6 transition-all text-emerald-950 font-medium resize-none" placeholder="Tell us more about your request..."></textarea>
              </div>

              <button type="submit" className="w-full bg-heritage-gradient text-gold-500 font-black py-6 rounded-[2rem] transition-all shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mt-10">
                SEND MESSAGE <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
