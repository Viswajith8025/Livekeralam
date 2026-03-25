import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, Share2, Heart, Loader2 } from 'lucide-react';
import api from '../services/api';
import ChatWindow from '../components/ChatWindow';
import { useWishlist } from '../context/WishlistContext';
import HeartButton from '../components/HeartButton';
import { encodeJourney } from '../utils/shareUtils';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleShare = () => {
    const code = encodeJourney({ events: [event], places: [] });
    const url = `${window.location.origin}/share/${code}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard!');
  };

  const handleBooking = async () => {
    try {
      setBookingLoading(true);
      // 1. Create Order on Backend
      const orderRes = await api.post('/payments/order', { eventId: id });
      const orderData = orderRes.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LiveKeralam',
        description: `Booking for ${event.title}`,
        order_id: orderData.id,
        handler: async (response) => {
          try {
            // 2. Verify Payment on Backend
            await api.post('/payments/verify', response);
            toast.success('Booking Successful! Experience awaits.');
          } catch (err) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: 'Traveler',
          email: 'traveler@livekeralam.com',
        },
        theme: {
          color: '#064e3b',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Failed to initiate booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Need to add a specific get event by ID route if it doesn't exist, 
        // but for now we can filter from all events or assume the backend has /events/:id
        const response = await api.get(`/events`); // This is inefficient but safe for now
        const found = response.data.data.find(e => e._id === id);
        if (found) {
          setEvent(found);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        setError('Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
      <Link to="/" className="text-indigo-600 font-bold flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-32 pb-20">
      <Helmet>
        <title>{event.title} | LiveKeralam</title>
        <meta name="description" content={event.description.substring(0, 160)} />
        <meta property="og:title" content={`${event.title} at ${event.location}`} />
        <meta property="og:description" content={event.description.substring(0, 160)} />
        <meta property="og:image" content={event.image} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Explorations
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 right-6 flex gap-3 z-30">
                <HeartButton item={event} type="event" className="shadow-xl" />
                <button 
                  onClick={handleShare}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl"
                >
                  <Share2 className="w-5 h-5 shadow-emerald-950" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
                  {event.district}
                </span>
                <span className="text-gray-400 font-medium">•</span>
                <span className="text-gray-500 font-bold">Approved Event</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 font-display tracking-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-8 py-6 border-y border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
                    <p className="text-sm font-black text-gray-900">{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</p>
                    <p className="text-sm font-black text-gray-900">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-indigo max-w-none">
                <h3 className="text-2xl font-black text-gray-900 font-display mb-4">About Event</h3>
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking & Chat */}
          <div className="space-y-8">
            <div className="bg-emerald-950 p-10 rounded-[3rem] shadow-2xl space-y-8 border border-white/5">
               <div className="space-y-2">
                 <p className="text-[10px] text-gold-500 font-black uppercase tracking-[0.4em]">Experience Cost</p>
                 <h2 className="text-5xl font-display font-medium text-white">
                   ₹{event.price || 499} <span className="text-sm font-medium text-white/30 italic">/ person</span>
                 </h2>
               </div>
               
               <button 
                 onClick={handleBooking}
                 disabled={bookingLoading}
                 className="w-full py-6 bg-gold-500 text-emerald-950 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-white transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 {bookingLoading ? (
                   <Loader2 className="w-4 h-4 animate-spin" />
                 ) : (
                   <>Reserve Spot <ArrowRight className="w-4 h-4" /></>
                 )}
               </button>

               <p className="text-[10px] text-white/30 text-center font-bold tracking-widest uppercase italic">
                 Verified Heritage Experience
               </p>
            </div>

            <ChatWindow eventId={event._id} eventTitle={event.title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
