import React from 'react';
import { 
  Sparkles, 
  Map, 
  Heart, 
  Users, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  Target,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-32 selection:bg-gold-500/30">
      
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="flex items-center gap-4 text-gold-600 animate-fade-in">
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">More Than a Map. A Movement.</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-display font-medium text-emerald-950 leading-[0.85] tracking-tighter">
              Kerala, <br /> <span className="italic text-gold-600">Decoded.</span>
            </h1>
            <p className="text-2xl text-emerald-900/60 leading-relaxed font-light italic max-w-xl">
              The pulse of God's Own Country, delivered in real-time. Discover the festivals, the flavors, and the hidden sanctuaries that maps can’t find.
            </p>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover"
                alt="Authentic Kerala"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent"></div>
            </div>
            <div className="absolute -bottom-10 -right-4 md:-right-10 bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl border border-emerald-900/5 max-w-xs backdrop-blur-sm bg-white/90">
              <div className="flex items-center gap-3 text-gold-600 mb-4">
                <Target className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Our Focus</span>
              </div>
              <p className="text-emerald-950 font-display text-2xl font-bold italic mb-2 leading-tight">"Truth in every trail."</p>
              <p className="text-emerald-900/50 text-xs font-medium leading-relaxed">Curating the collective heartbeat of Kerala with uncompromising authenticity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Section (The Silent Void) */}
      <section className="bg-emerald-950 py-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
             <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mb-8">
                <AlertCircle className="w-10 h-10 text-gold-500" />
             </div>
             <h2 className="text-5xl md:text-6xl font-display font-medium text-white tracking-tighter leading-tight mb-8">
               The <span className="text-gold-500 italic">Silent Void</span> in Modern Travel.
             </h2>
             <div className="space-y-6 text-xl text-white/50 font-light leading-relaxed italic">
               <p>Kerala is legendary, but as an experience, it remains fragmented.</p>
               <p>Local festivals go unannounced. Iconic heritage spots stay hidden behind maps. Travelers miss the vibrant heartbeat of the land just a few miles away.</p>
             </div>
          </div>
          <div className="p-12 bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-sm">
             <div className="space-y-12">
                {[
                  { t: "Scattered Info", d: "Events are buried in local papers and word-of-mouth." },
                  { t: "Filtered Reality", d: "Tourists see the brochure, not the real soul." },
                  { t: "Missed Moments", d: "Legendary rituals happening today, unknown to you." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="text-gold-500 font-display text-4xl opacity-30 italic">{idx + 1}</div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.t}</h4>
                      <p className="text-white/40 text-sm leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 3. Solution Section (One Pulse) */}
      <section className="py-40 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-full text-gold-600 border border-emerald-100">
            <CheckCircle className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">The LiveKeralam Answer</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-display font-medium text-emerald-950 tracking-tighter">
            One Pulse. <span className="italic text-gold-600">One Platform.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-emerald-900/60 italic font-light">
            We curate the chaos of scattered information into a single, intuitive stream of live events, Landmarks, and authentic experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Zap className="w-8 h-8" />, 
              title: "Real-Time Discovery", 
              desc: "From temple festivals to art exhibitions, know what's happening NOW in any district." 
            },
            { 
              icon: <Map className="w-8 h-8" />, 
              title: "Deep Curation", 
              desc: "Verified heritage spots and hidden trails vetted by local experts and historians." 
            },
            { 
              icon: <Users className="w-8 h-8" />, 
              title: "Organizer Stage", 
              desc: "Empowering local artisans and community leaders with a premium global audience." 
            }
          ].map((item, idx) => (
            <div key={idx} className="p-12 bg-white rounded-[3rem] border border-emerald-900/5 shadow-xl shadow-emerald-950/5 hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-gold-50/50 text-gold-600 rounded-2xl flex items-center justify-center mb-10">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-emerald-950 mb-4">{item.title}</h3>
              <p className="text-emerald-800/60 leading-relaxed font-medium text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Vision Section */}
      <section className="bg-emerald-100/30 py-40 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <TrendingUp className="w-12 h-12 text-gold-600 mx-auto" />
          <h2 className="text-4xl md:text-6xl font-display font-bold italic text-emerald-950 leading-tight">
            "To be the central nervous system of Kerala's tourism economy."
          </h2>
          <p className="text-xl text-emerald-900/60 leading-relaxed font-light italic">
            At LiveKeralam, we believe technology should not replace the experience, but rather, illuminate it. We envision a world where every artisan is discovered, and every traveler leaves with a story that is uniquely their own.
          </p>
        </div>
      </section>

      {/* 5. Roadmap Section */}
      <section className="py-40 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="w-full md:w-1/2 space-y-10">
             <div className="flex items-center gap-4 text-gold-600">
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">The Journey Ahead</span>
             </div>
             <h2 className="text-6xl font-display font-medium text-emerald-950 tracking-tighter">
               Building the <br /><span className="italic text-gold-600">Future of Heritage.</span>
             </h2>
             <p className="text-lg text-emerald-900/60 italic font-light">
               We’re not just building an app; we’re building an ecosystem. Our roadmap is designed to empower both the seeker and the source.
             </p>
          </div>
          <div className="w-full md:w-1/2 space-y-8">
             {[
               { p: "Phase 1 - Sync", d: "Real-time event synchronization and district-wide discovery.", s: "Completed" },
               { p: "Phase 2 - SoulSync", d: "AI-driven vibe-based itineraries and heritage planning.", s: "Live" },
               { p: "Phase 3 - Ecosystem", d: "Verified local guide integration and cultural storytelling.", s: "Coming Q4" }
             ].map((phase, idx) => (
               <div key={idx} className="p-8 bg-white border border-emerald-900/5 rounded-3xl shadow-lg relative flex items-center justify-between group overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-950 group-hover:w-full transition-all duration-700 opacity-5"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold-600 mb-1">{phase.p}</p>
                    <h4 className="text-xl font-bold text-emerald-950">{phase.d}</h4>
                  </div>
                  <div className={`relative z-10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${phase.s === 'Coming Q4' ? 'bg-emerald-50 text-emerald-400' : 'bg-gold-50 text-gold-600'}`}>
                    {phase.s}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="bg-heritage-gradient rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden shadow-3xl shadow-emerald-950/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="relative z-10 space-y-12">
            <h2 className="text-5xl md:text-8xl font-display font-medium text-white tracking-tighter leading-none">
               Stop Searching. <br /> <span className="text-gold-500 italic">Start Experiencing.</span>
            </h2>
            <p className="text-xl text-white/60 max-w-xl mx-auto font-light italic">
               Kerala is happening right now. Are you ready to find it?
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 pt-8">
              <Link to="/events" className="px-16 py-8 bg-gold-600 text-emerald-950 rounded-[2rem] font-black text-[10px] tracking-[0.4em] uppercase hover:scale-105 transition-all shadow-2xl flex items-center gap-4">
                Explore Live Events <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="px-16 py-8 bg-white/10 text-white rounded-[2rem] font-black text-[10px] tracking-[0.4em] uppercase hover:bg-white/20 transition-all border border-white/20">
                Partner with us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
