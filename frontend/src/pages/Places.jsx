import React, { useEffect, useState } from 'react';
import { MapPin, Loader2, Compass, Sparkles, Footprints, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { PlaceCardSkeleton } from '../components/Skeleton';
import HeartButton from '../components/HeartButton';
import { Helmet } from 'react-helmet-async';

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await api.get('/places');
        setPlaces(response.data.data);
      } catch (err) {
        setError('Could not load places. Please try again later.');
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-40 pb-40">
      <Helmet>
        <title>Heritage Places | LiveKeralam</title>
        <meta name="description" content="Explore sacred temples, historic forts, and serene backwater sanctuaries in Kerala." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-6 py-20 relative">
        
        <div className="text-center mb-32 space-y-10 relative">
          <div className="flex items-center justify-center gap-4 text-gold-600 animate-in fade-in duration-1000">
             <div className="h-px w-8 bg-gold-600/30"></div>
             <Footprints className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sacred Destinations</span>
             <div className="h-px w-8 bg-gold-600/30"></div>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-display font-medium text-emerald-950 leading-[0.9] tracking-tighter">
            God's Own <br /> <span className="italic text-gold-600 underline decoration-gold-600/20 underline-offset-8">Sanctuaries.</span>
          </h1>
          
          <p className="text-xl text-emerald-900/60 max-w-2xl mx-auto leading-relaxed font-light italic">
            Descend into the heart of Malabar, wander through the Western Ghats, and find your soul in the stillness of the backwaters.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {[1, 2, 3].map((i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-12 rounded-[3.5rem] text-center max-w-lg mx-auto border border-red-100 shadow-2xl">
            <h4 className="font-display text-2xl mb-3">Haven unreachable</h4>
            <p className="opacity-70 font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 relative">
            {places.map((place) => (
              <div key={place._id} className="group relative">
                {/* Decorative background depth */}
                <div className="absolute inset-0 bg-emerald-900/5 rounded-[4rem] group-hover:scale-105 transition-transform duration-700"></div>
                
                <div className="relative bg-white border border-emerald-900/5 rounded-[3.5rem] overflow-hidden shadow-2xl shadow-emerald-900/5 p-4 hover:shadow-gold-500/10 transition-all duration-700">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] relative ring-1 ring-emerald-900/10">
                    <img 
                      src={place.image} 
                      alt={place.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-6 right-6 bg-emerald-950/80 backdrop-blur-md px-5 py-2.5 rounded-2xl text-[10px] font-black text-gold-500 uppercase tracking-widest border border-gold-500/30">
                      {place.category || 'Spotlight'}
                    </div>
                    <HeartButton item={place} type="place" className="absolute top-6 left-6 z-20" />
                  </div>
                  
                  <div className="p-8 pt-10 text-center space-y-6">
                    <div className="flex items-center justify-center gap-2 text-gold-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest">{place.district}</span>
                    </div>
                    
                    <h3 className="text-4xl font-display font-bold text-emerald-950 group-hover:text-gold-600 transition-colors leading-[1.1]">
                      {place.name}
                    </h3>
                    
                    <p className="text-emerald-900/50 leading-relaxed line-clamp-2 font-medium italic text-base">
                      {place.description}
                    </p>
                    
                    <div className="h-px w-12 bg-emerald-900/10 mx-auto"></div>
                    
                    <button className="text-emerald-900 font-black text-[10px] tracking-[0.4em] uppercase hover:text-gold-600 transition-all flex items-center justify-center gap-3 w-full">
                      Begin Voyage <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && places.length === 0 && (
          <div className="text-center py-52 bg-emerald-900/5 rounded-[5rem] border-2 border-dashed border-emerald-900/10">
            <Compass className="w-20 h-20 text-emerald-900/20 mx-auto mb-8" />
            <h3 className="text-4xl font-display text-emerald-900 mb-2">No havens discovered</h3>
            <p className="text-emerald-900/40 font-medium italic">The maps are being redrawn. Check back for new trails.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Places;
