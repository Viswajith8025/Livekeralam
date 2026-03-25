import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Places from './pages/Places';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EventDetail from './pages/EventDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import SharedJourney from './pages/SharedJourney';
import SoulSync from './pages/SoulSync';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import { WishlistProvider } from './context/WishlistContext';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function App() {
  useEffect(() => {
    const socket = io(API_URL.replace('/api/v1', ''));

    socket.on('new_event', (data) => {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white/90 backdrop-blur-xl shadow-2xl rounded-[1.5rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 border border-indigo-100`}>
          <div className="flex-1 w-0 p-1">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 flex items-center justify-center bg-indigo-600 rounded-full text-white font-bold text-xs ring-4 ring-indigo-50">
                  NEW
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-black text-gray-900 font-display">
                  New Event in {data.district}!
                </p>
                <p className="mt-1 text-sm text-gray-500 font-medium line-clamp-1">
                  {data.title}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-100 pl-4 ml-4">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-2 flex items-center justify-center text-xs font-bold text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              Dismiss
            </button>
          </div>
        </div>
      ), { duration: 5000 });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <WishlistProvider>
          <div className="flex flex-col min-h-screen">
            <Toaster position="top-right" />
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow bg-[#FDFDFF]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/places" element={<Places />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/soulsync" element={<SoulSync />} />
                <Route path="/share/:code" element={<SharedJourney />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </WishlistProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
