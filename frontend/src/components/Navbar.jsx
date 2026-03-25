import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Heart, Menu, X, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleAuthChange = () => setIsLoggedIn(!!localStorage.getItem('token'));

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center px-4 py-6 ${isScrolled ? 'pt-4' : 'pt-8'}`}>
      <div className={`w-full max-w-6xl transition-all duration-500 rounded-[2rem] border border-white/20 backdrop-blur-2xl shadow-2xl flex items-center justify-between px-6 py-4 ${
        isScrolled ? 'bg-emerald-950/90 py-3 shadow-emerald-900/20' : 'bg-white/10'
      }`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-heritage-gradient p-1.5 rounded-2xl shadow-lg ring-1 ring-white/20 group-hover:scale-110 transition-transform overflow-hidden w-11 h-11 flex items-center justify-center">
            <img src={logo} alt="LiveKeralam Logo" className="w-full h-full object-contain" />
          </div>
          <span className={`text-2xl font-display font-black tracking-tight ${isScrolled ? 'text-white' : 'text-emerald-900'}`}>
            Live<span className="text-gold-500 italic">Keralam</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/#events" className={`font-bold text-sm tracking-wide uppercase transition-colors ${isScrolled ? 'text-gray-300 hover:text-gold-500' : 'text-emerald-900 hover:text-emerald-700'}`}>Events</Link>
          <Link to="/places" className={`font-bold text-sm tracking-wide uppercase transition-colors ${isScrolled ? 'text-gray-300 hover:text-gold-500' : 'text-emerald-900 hover:text-emerald-700'}`}>Places</Link>
          <Link to="/about" className={`font-bold text-sm tracking-wide uppercase transition-colors ${isScrolled ? 'text-gray-300 hover:text-gold-500' : 'text-emerald-900 hover:text-emerald-700'}`}>About</Link>
          <Link to="/contact" className={`font-bold text-sm tracking-wide uppercase transition-colors ${isScrolled ? 'text-gray-300 hover:text-gold-500' : 'text-emerald-900 hover:text-emerald-700'}`}>Contact</Link>
          
          <Link to="/soulsync" className="flex items-center gap-2 px-5 py-2.5 bg-gold-500/10 border border-gold-500/30 rounded-xl group hover:bg-gold-500/20 transition-all">
            <Sparkles className="w-4 h-4 text-gold-600 group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-black text-gold-600 uppercase tracking-widest">SoulSync AI</span>
          </Link>
          
          <Link to="/wishlist" className="relative group p-2">
            <Heart className={`w-6 h-6 transition-all ${isScrolled ? 'text-white group-hover:text-gold-500' : 'text-emerald-950 group-hover:text-emerald-700'}`} />
            { (useWishlist().wishlist.events.length + useWishlist().wishlist.places.length) > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-emerald-950 animate-bounce">
                {useWishlist().wishlist.events.length + useWishlist().wishlist.places.length}
              </span>
            )}
          </Link>
          
          <div className="h-6 w-px bg-white/10 mx-2"></div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/admin" className="p-2.5 bg-white/10 rounded-xl hover:bg-gold-500 group transition-all">
                <LayoutDashboard className="w-5 h-5 text-gold-500 group-hover:text-emerald-950" />
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-gold-500 text-emerald-950 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-white transition-all shadow-lg shadow-gold-500/10"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className={`font-bold text-sm tracking-wide uppercase transition-colors ${isScrolled ? 'text-white' : 'text-emerald-900'}`}>
                Login
              </Link>
              <Link to="/register" className="bg-heritage-gradient text-gold-500 border border-gold-500/30 px-7 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
                JOIN EXCLUSIVE
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden p-2 rounded-xl transition-colors ${isScrolled ? 'text-white bg-white/10' : 'text-emerald-900 bg-emerald-50'}`}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Drawer (simplified for now) */}
      {isOpen && (
        <div className="fixed inset-0 top-[100px] z-40 px-4 md:hidden">
          <div className="bg-emerald-950/95 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-8 shadow-2xl animate-in slide-in-from-top-4">
            <div className="space-y-6">
              <Link to="/#events" onClick={() => setIsOpen(false)} className="block text-3xl font-display font-bold text-white">Events</Link>
              <Link to="/places" onClick={() => setIsOpen(false)} className="block text-3xl font-display font-bold text-white">Places</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block text-3xl font-display font-bold text-white">Our Story</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-3xl font-display font-bold text-white">Contact</Link>
              <div className="h-px bg-white/10 my-8"></div>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="w-full bg-gold-500 text-emerald-950 py-5 rounded-2xl font-black">LOGOUT</button>
              ) : (
                <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center bg-gold-500 text-emerald-950 py-5 rounded-2xl font-black">JOIN EXCLUSIVE</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
