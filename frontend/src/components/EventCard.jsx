import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import HeartButton from './HeartButton';

const EventCard = ({ event }) => {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="group relative">
      {/* Layered Decorative Border */}
      <div className="absolute inset-0 bg-gold-500/10 rounded-[3rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
      
      <div className="relative bg-white border border-emerald-900/5 rounded-[2.5rem] p-5 shadow-xl shadow-emerald-900/5 hover:shadow-gold-500/10 transition-all duration-500">
        {/* Image Container with Gold Accent */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-8 ring-1 ring-emerald-900/10">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" 
          />
          
          {/* Top Badge */}
          <div className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 bg-emerald-950/80 backdrop-blur-md rounded-full border border-gold-500/30">
            <Sparkles className="w-3 h-3 text-gold-500" />
            <span className="text-[10px] font-black text-gold-500 uppercase tracking-[0.2em]">Exclusive</span>
          </div>

          <HeartButton item={event} type="event" className="absolute top-5 right-5 z-20" />

          {/* Date Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-emerald-950/90 to-transparent">
             <p className="text-white font-display text-2xl italic">{formattedDate}</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 px-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af37] bg-emerald-950 px-3 py-1 rounded-full group-hover:bg-[#d4af37] group-hover:text-emerald-950 transition-colors">
                    {event.category}
                  </span>
          
          <h3 className="text-3xl font-display font-bold text-emerald-950 leading-[1.1] group-hover:text-gold-600 transition-colors">
            {event.title}
          </h3>
          
          <div className="flex items-center gap-3 text-gray-500">
            <MapPin className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium tracking-tight uppercase">{event.location}</span>
          </div>

          <Link 
            to={`/events/${event._id}`} 
            className="mt-6 w-full py-5 bg-emerald-900 text-gold-500 rounded-2xl flex items-center justify-center gap-3 group/btn relative overflow-hidden transition-all hover:bg-emerald-950 shadow-lg shadow-emerald-900/20"
          >
             <span className="font-black text-xs tracking-[0.3em] uppercase">Reserve Spot</span>
             <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
