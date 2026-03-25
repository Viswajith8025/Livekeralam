import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart, MapPin, Calendar, Compass, Share2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

const SoulSync = () => {
  const [step, setStep] = useState(1);
  const [vibe, setVibe] = useState('');
  const [generating, setGenerating] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const { wishlist } = useWishlist();

  const vibes = [
    { id: 'spiritual', label: 'Spiritual Peace', icon: '🕯️', desc: 'Ancient temples, sunrise rituals, and silence.' },
    { id: 'vibrant', label: 'Vibrant Heritage', icon: '🥁', desc: 'Traditional festivals, loud drums, and street life.' },
    { id: 'nature', label: 'Luxury Nature', icon: '🐘', desc: 'Mist-covered ghats and silent backwater cruises.' },
    { id: 'urban', label: 'Bazaar & Beats', icon: '🛍️', desc: 'Historic markets, colonial cafes, and modern rhythms.' }
  ];

  const generateItinerary = () => {
    setGenerating(true);
    // Simulate AI "Processing"
    setTimeout(() => {
      // Logic: Pick 2-3 items from wishlist (if any) + suggestions
      const blueprint = {
        title: `${vibe.charAt(0).toUpperCase() + vibe.slice(1)} Heritage Blueprint`,
        day1: {
          morning: wishlist.places[0]?.name || "Local Heritage Walk",
          afternoon: wishlist.events[0]?.title || "Cultural Workshop",
          evening: "Sunset Viewpoint"
        },
        day2: {
          morning: "Local Culinary Trail",
          afternoon: wishlist.places[1]?.name || "Ancient Monument",
          evening: "Traditional Performance"
        }
      };
      setItinerary(blueprint);
      setGenerating(false);
      setStep(3);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F1] pt-32 pb-40">
      <div className="max-w-4xl mx-auto px-6">
        
        {step === 1 && (
          <div className="space-y-16 text-center animate-in fade-in duration-700">
             <div className="space-y-6">
                <div className="flex items-center justify-center gap-4 text-gold-600">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Phase 2 Alpha</span>
                </div>
                <h1 className="text-8xl font-display font-medium text-emerald-950 leading-none">
                  Soul<span className="italic text-gold-600">Sync.</span>
                </h1>
                <p className="text-xl text-emerald-900/60 max-w-xl mx-auto font-light italic">
                  Let our cultural engine orchestrate your perfect 48-hour journey through the heart of Kerala.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vibes.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setVibe(item.id); setStep(2); }}
                    className="p-10 bg-white border border-emerald-900/5 rounded-[3rem] text-left hover:border-gold-500/30 transition-all hover:shadow-2xl hover:shadow-gold-500/10 group active:scale-95"
                  >
                    <span className="text-4xl mb-6 block">{item.icon}</span>
                    <h3 className="text-2xl font-display font-bold text-emerald-950 mb-2 group-hover:text-gold-600">
                      {item.label}
                    </h3>
                    <p className="text-emerald-900/40 text-sm font-medium">{item.desc}</p>
                  </button>
                ))}
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-16 py-20 animate-in zoom-in duration-1000">
             {!generating ? (
               <div className="space-y-12">
                  <div className="w-24 h-24 bg-emerald-900 text-gold-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <Compass className="w-10 h-10 animate-spin-slow" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-display font-medium text-emerald-950">
                      Orchestrating <span className="italic">Traditions...</span>
                    </h2>
                    <p className="text-emerald-900/50 font-medium italic">Analyzing your {wishlist.events.length + wishlist.places.length} saved favorites</p>
                  </div>
                  <button 
                    onClick={generateItinerary}
                    className="px-16 py-6 bg-gold-500 text-emerald-950 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-xl shadow-gold-500/20"
                  >
                    Sync My Soul
                  </button>
               </div>
             ) : (
               <div className="space-y-12">
                  <div className="relative w-40 h-40 mx-auto">
                    <div className="absolute inset-0 border-4 border-emerald-900/5 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-gold-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">🧩</div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-display text-emerald-950">Syncing with Kerala's Soul</h3>
                    <p className="text-emerald-900/40 animate-pulse font-medium italic">Fetching spiritual coordinates...</p>
                  </div>
               </div>
             )}
          </div>
        )}

        {step === 3 && itinerary && (
          <div className="space-y-16 animate-in slide-in-from-bottom-12 duration-1000">
             <div className="flex justify-between items-end">
                <div className="space-y-4">
                  <h2 className="text-6xl font-display font-medium text-emerald-950">
                    Your <br/> <span className="text-gold-600 italic">48-Hour Protocol.</span>
                  </h2>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-emerald-900 text-gold-500 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl">
                   <Share2 className="w-4 h-4" /> Export Plan
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Day 1 */}
                <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-emerald-900/5 space-y-10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 font-black italic">D1</div>
                   <div className="flex items-center gap-4 text-emerald-900/40">
                      <Zap className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Day One: The Awakening</span>
                   </div>
                   <div className="space-y-8">
                      <div className="space-y-2">
                         <span className="text-[10px] font-black text-gold-600 uppercase">Morning</span>
                         <p className="text-2xl font-display font-bold text-emerald-950">{itinerary.day1.morning}</p>
                      </div>
                      <div className="space-y-2">
                         <span className="text-[10px] font-black text-gold-600 uppercase">Afternoon</span>
                         <p className="text-2xl font-display font-bold text-emerald-950">{itinerary.day1.afternoon}</p>
                      </div>
                      <div className="space-y-2">
                         <span className="text-[10px] font-black text-gold-600 uppercase">Evening</span>
                         <p className="text-2xl font-display font-bold text-emerald-950">{itinerary.day1.evening}</p>
                      </div>
                   </div>
                </div>

                {/* Day 2 */}
                <div className="bg-emerald-950 p-12 rounded-[4rem] shadow-xl space-y-10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 text-6xl text-white opacity-5 font-black italic">D2</div>
                   <div className="flex items-center gap-4 text-white/30">
                      <Zap className="w-5 h-5 text-gold-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Day Two: The Deep Dive</span>
                   </div>
                   <div className="space-y-8">
                      <div className="space-y-2">
                         <span className="text-[10px] font-black text-gold-500 uppercase">Morning</span>
                         <p className="text-2xl font-display font-bold text-white">{itinerary.day2.morning}</p>
                      </div>
                      <div className="space-y-2">
                         <span className="text-[10px] font-black text-gold-500 uppercase">Afternoon</span>
                         <p className="text-2xl font-display font-bold text-white">{itinerary.day2.afternoon}</p>
                      </div>
                      <div className="space-y-2">
                         <span className="text-[10px] font-black text-gold-500 uppercase">Evening</span>
                         <p className="text-2xl font-display font-bold text-white">{itinerary.day2.evening}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-gold-500/10 border border-gold-500/20 p-10 rounded-[3rem] flex items-center gap-8">
                <ShieldCheck className="w-12 h-12 text-gold-600 shrink-0" />
                <div className="space-y-1">
                   <h4 className="text-emerald-950 font-bold text-xl uppercase tracking-tight">Verified by Protocol AI</h4>
                   <p className="text-emerald-900/60 font-medium italic text-sm">This itinerary is optimized for low-crowd hours and seasonal heritage alignment.</p>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SoulSync;
