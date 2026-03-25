import React from 'react';
import { Calendar, Globe, Share2, Send, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-emerald-900/20">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-heritage-gradient p-1.5 rounded-xl w-10 h-10 flex items-center justify-center overflow-hidden ring-1 ring-white/10">
                <img src={logo} alt="LiveKeralam Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-display font-bold tracking-tight">Live<span className="text-gold-500 italic">Keralam</span></span>
              <span className="text-[8px] bg-emerald-900/40 px-2 py-0.5 rounded text-white/50 font-mono">v1.0.2-prod</span>
            </Link>
            <p className="text-gray-400 leading-relaxed font-light italic">
              Experience the soul of God's Own Country through curated celebrations and legendary traditions.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Upcoming Events</Link></li>
              <li><Link to="/places" className="hover:text-white transition-colors">Tourist Places</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Manage Events</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">About Kerala</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6">Categories</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Cultural Festivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tech Conferences</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Adventure Tours</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Art Exhibitions</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 mt-1 flex-shrink-0" />
                <span>Thiruvananthapuram, Kerala, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <span>+91 471 2345678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <span>hello@livekeralam.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 LiveKeralam. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white border-b border-transparent hover:border-white transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-white border-b border-transparent hover:border-white transition-all">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
