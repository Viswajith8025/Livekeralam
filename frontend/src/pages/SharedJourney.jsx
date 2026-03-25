import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, Compass, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { decodeJourney } from '../utils/shareUtils';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { MapPin as MapPinIcon } from 'lucide-react';

const SharedJourney = () => {
  const { code } = useParams();
  const [data, setData] = useState({ events: [], places: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { eventIds, placeIds } = decodeJourney(code);
      
      try {
        setLoading(true);
        // In a real app, you'd have a bulk fetch endpoint. 
        // For this startup MVP, we'll fetch all and filter or just let it be.
        // Actually, fetching all events/places is fine for current scale.
        const [eventsRes, placesRes] = await Promise.all([
          api.get('/events'),
          api.get('/places')
        ]);

        const sharedEvents = eventsRes.data.data.filter(e => eventIds.includes(e._id));
        const sharedPlaces = placesRes.data.data.filter(p => placeIds.includes(p._id));

        setData({ events: sharedEvents, places: sharedPlaces });
      } catch (error) {
        console.error("Shared journey load failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6F1]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-900"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F6F1] pt-32 pb-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 space-y-6 text-center">
          <div className="flex items-center justify-center gap-4 text-gold-600">
             <Share2 className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Shared Collection</span>
          </div>
          <h1 className="text-7xl font-display font-medium text-emerald-950">
            Heritage <span className="italic text-gold-600">Discoveries.</span>
          </h1>
          <p className="text-xl text-emerald-900/60 max-w-2xl mx-auto font-light italic">
            A friend has shared their curated selection of Kerala's most iconic experiences with you.
          </p>
        </div>

        {data.events.length === 0 && data.places.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[4rem] border border-emerald-900/5 shadow-xl">
             <Compass className="w-20 h-20 text-emerald-900/10 mx-auto mb-8" />
             <h3 className="text-3xl font-display text-emerald-950 mb-4">Journey Unreachable</h3>
             <p className="text-emerald-900/50 mb-10 max-w-xs mx-auto font-medium italic">
               This shared link seems to be empty or expired. Why not start your own journey?
             </p>
             <Link to="/" className="px-12 py-5 bg-emerald-900 text-gold-500 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-emerald-950 transition-all shadow-xl">
               Start My Journey
             </Link>
          </div>
        ) : (
          <div className="space-y-32">
             {data.events.length > 0 && (
              <section className="space-y-16">
                <h2 className="text-4xl font-display font-bold text-emerald-950 pb-8 border-b border-emerald-900/10 flex items-center gap-4">
                  <Sparkles className="w-8 h-8 text-gold-600" />
                  Recommended Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                  {data.events.map(event => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </section>
            )}

            {data.places.length > 0 && (
              <section className="space-y-16">
                <h2 className="text-4xl font-display font-bold text-emerald-950 pb-8 border-b border-emerald-900/10 flex items-center gap-4">
                  <MapPinIcon className="w-8 h-8 text-gold-600" />
                  Recommended Places
                </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                  {data.places.map(place => (
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
            
            <div className="pt-20 text-center text-emerald-900/30">
               <p className="font-display text-2xl italic tracking-tight">Inspired? Start your own story on <span className="font-bold text-emerald-900">LiveKeralam</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedJourney;
