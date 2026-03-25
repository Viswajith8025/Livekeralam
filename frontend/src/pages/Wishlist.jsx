import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, MapPin, Sparkles, Compass, Share2, Check } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { encodeJourney } from '../utils/shareUtils';
import EventCard from '../components/EventCard';
import { MapPin as MapPinIcon } from 'lucide-react';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const [copied, setCopied] = React.useState(false);
  const isEmpty = wishlist.events.length === 0 && wishlist.places.length === 0;

  const handleShare = () => {
    const code = encodeJourney(wishlist);
    const url = `${window.location.origin}/share/${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F1] pt-32 pb-40">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gold-600">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Personal Collection</span>
              </div>
              <h1 className="text-7xl font-display font-medium text-emerald-950 leading-none">
                My <span className="italic text-gold-600">Journey.</span>
              </h1>
            </div>
            
            {!isEmpty && (
              <button 
                onClick={handleShare}
                className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl ${
                  copied 
                    ? 'bg-emerald-900 text-gold-500 shadow-emerald-900/40 translate-y-[-2px]' 
                    : 'bg-white text-emerald-900 border border-emerald-900/10 hover:bg-emerald-50'
                }`}
              >
                {copied ? (
                  <><Check className="w-4 h-4" /> Link Copied</>
                ) : (
                  <><Share2 className="w-4 h-4" /> Share My Journey</>
                )}
              </button>
            )}
          </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border border-emerald-900/5 shadow-xl">
            <Compass className="w-20 h-20 text-emerald-900/10 mb-8" />
            <h3 className="text-3xl font-display text-emerald-950 mb-4">Your journal is empty</h3>
            <p className="text-emerald-900/50 mb-10 max-w-xs text-center font-medium italic">
              Start exploring events and places to build your personalized heritage trail.
            </p>
            <Link 
              to="/" 
              className="px-12 py-5 bg-emerald-900 text-gold-500 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-3"
            >
              Explore Traditions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-32">
            {/* Events Section */}
            {wishlist.events.length > 0 && (
              <section className="space-y-16">
                <h2 className="text-4xl font-display font-bold text-emerald-950 pb-8 border-b border-emerald-900/10 flex items-center gap-4">
                  <Sparkles className="w-8 h-8 text-gold-600" />
                  Saved Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                  {wishlist.events.map(event => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </section>
            )}

            {/* Places Section */}
            {wishlist.places.length > 0 && (
              <section className="space-y-16">
                <h2 className="text-4xl font-display font-bold text-emerald-950 pb-8 border-b border-emerald-900/10 flex items-center gap-4">
                  <MapPinIcon className="w-8 h-8 text-gold-600" />
                  Sacred Places
                </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                  {wishlist.places.map(place => (
                    <div key={place._id} className="group relative">
                      <div className="absolute inset-0 bg-emerald-900/5 rounded-[4rem] group-hover:scale-105 transition-transform duration-700"></div>
                      <div className="relative bg-white border border-emerald-900/5 rounded-[3.5rem] overflow-hidden shadow-2xl shadow-emerald-900/5 p-4 transition-all duration-700">
                        <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] relative">
                          <img src={place.image} className="w-full h-full object-cover" alt={place.name} />
                          <div className="absolute top-6 right-6 bg-emerald-950/80 backdrop-blur-md px-5 py-2.5 rounded-2xl text-[10px] font-black text-gold-500 uppercase tracking-widest border border-gold-500/30">
                            {place.category || 'Spotlight'}
                          </div>
                        </div>
                        <div className="p-8 pt-10 text-center space-y-6">
                           <div className="flex items-center justify-center gap-2 text-gold-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{place.district}</span>
                          </div>
                          <h3 className="text-4xl font-display font-bold text-emerald-950 leading-[1.1]">{place.name}</h3>
                          <p className="text-emerald-900/50 leading-relaxed line-clamp-2 font-medium italic">{place.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
