import React from 'react';
import { Sparkles, Map, Heart, Users, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-32">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="flex items-center gap-4 text-gold-600">
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Our Story</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-display font-medium text-emerald-950 leading-[0.9] tracking-tighter">
              Discover the Soul of <br /> <span className="italic text-gold-600">God's Own Country.</span>
            </h1>
            <p className="text-xl text-emerald-900/60 leading-relaxed font-light italic max-w-xl">
              LiveKeralam isn't just a platform; it's a digital bridge to the vibrant traditions, hidden sanctuaries, and legendary experiences that define Kerala.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-1000">
              <img 
                src="https://images.unsplash.com/photo-1593693397690-362ae966b750?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover scale-110"
                alt="Kerala Culture"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[3rem] shadow-2xl border border-emerald-900/5 max-w-xs animate-float">
              <p className="text-emerald-950 font-display text-2xl font-bold italic mb-2">"Authenticity is our compass."</p>
              <p className="text-emerald-900/40 text-sm font-medium leading-relaxed">Curating every festival, every trail, and every moment with deep cultural respect.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-emerald-950 text-white py-40 my-40 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="space-y-6">
              <Map className="w-12 h-12 text-gold-500 mb-8" />
              <h3 className="text-3xl font-display font-bold">Unseen Trails</h3>
              <p className="text-white/40 leading-relaxed font-medium">We dive deep into the heart of Kerala to bring you locations and experiences that aren't on any other map.</p>
            </div>
            <div className="space-y-6">
              <Heart className="w-12 h-12 text-gold-500 mb-8" />
              <h3 className="text-3xl font-display font-bold">Rooted Identity</h3>
              <p className="text-white/40 leading-relaxed font-medium">Our platform celebrates the heritage, art, and spirituality that make Kerala truly divine.</p>
            </div>
            <div className="space-y-6">
              <Users className="w-12 h-12 text-gold-500 mb-8" />
              <h3 className="text-3xl font-display font-bold">Community First</h3>
              <p className="text-white/40 leading-relaxed font-medium">We empower local organizers and artisans by giving them a premium global stage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="max-w-7xl mx-auto px-6 py-40 text-center space-y-12">
        <h2 className="text-5xl md:text-7xl font-display font-medium text-emerald-950 tracking-tighter">
          Ready to experience the <br /> <span className="text-gold-600 italic underline decoration-gold-600/20 underline-offset-8">authentic</span> Kerala?
        </h2>
        <div className="flex justify-center pt-8">
          <button className="px-16 py-8 bg-gold-600 text-emerald-950 rounded-[2rem] font-black text-[10px] tracking-[0.4em] uppercase hover:scale-105 transition-all shadow-2xl shadow-gold-600/30 flex items-center gap-4 group">
            Explore Traditions <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
