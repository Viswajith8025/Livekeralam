import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Sparkles, Save, Shield, MapPin, Heart, ChevronRight, Check, Camera, Loader2, MessageSquare, ShieldCheck } from 'lucide-react';
import SupportChat from '../components/SupportChat';
import { getImageUrl } from '../services/api';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';

const CATEGORIES = [
    'Temple Festivals',
    'Sacred Rituals',
    'Art Forms',
    'Heritage Sites',
    'Beach',
    'Hill Station',
    'Backwater',
    'Waterfall',
    'Nature',
    'Spiritual'
];

const COUNTRY_CODES = [
    { code: '+91', country: 'IN' },
    { code: '+1', country: 'US' },
    { code: '+44', country: 'UK' },
    { code: '+971', country: 'UAE' },
    { code: '+61', country: 'AU' },
    { code: '+65', country: 'SG' },
    { code: '+49', country: 'DE' }
];

const Profile = () => {
    const { user, login } = useAuth();
    const { wishlist, followedDistricts } = useWishlist();

    // Extract country code from stored phone if possible
    const getInitialPhoneParts = () => {
        const phone = user?.phone || '';
        const matched = COUNTRY_CODES.find(c => phone.startsWith(c.code));
        if (matched) {
            return { code: matched.code, number: phone.replace(matched.code, '').trim() };
        }
        return { code: '+91', number: phone };
    };

    const initialParts = getInitialPhoneParts();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        countryCode: initialParts.code,
        phone: initialParts.number,
        interests: user?.interests || []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [enquiries, setEnquiries] = useState([]);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        if (user) {
            const fetchEnquiries = async () => {
                try {
                    const response = await api.get('/contact/me');
                    setEnquiries(response.data.data);
                } catch (err) {
                    console.error('Enquiry fetch error:', err);
                }
            };
            fetchEnquiries();
            
            const parts = getInitialPhoneParts();
            setFormData({
                name: user.name,
                email: user.email,
                countryCode: parts.code,
                phone: parts.number,
                interests: user.interests || []
            });
        }
    }, [user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        setLoading(true);
        try {
            const response = await api.post('/user/profile-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                login(localStorage.getItem('token'), response.data.data);
                toast.success('Identity Portrait Updated', {
                    style: { borderRadius: '1rem', background: '#064e3b', color: '#fbbf24' }
                });
            }
        } catch (err) {
            toast.error('Frame capture failed');
        } finally {
            setLoading(false);
        }
    };

    const handleInterestToggle = (cat) => {
        const newInterests = formData.interests.includes(cat)
            ? formData.interests.filter(i => i !== cat)
            : [...formData.interests, cat];
        setFormData({ ...formData, interests: newInterests });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const fullPhone = `${formData.countryCode} ${formData.phone}`.trim();
            const payload = { ...formData, phone: fullPhone };
            const response = await api.put('/user/profile', payload);
            if (response.data.success) {
                // Update local auth context with new user data
                login(localStorage.getItem('token'), response.data.data);
                toast.success('Profile Updated', {
                    style: { borderRadius: '1rem', background: '#064e3b', color: '#fbbf24' }
                });
                setIsEditing(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left Column: Personal Narrative */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="relative group/avatar">
                            <div className="w-48 h-48 bg-heritage-gradient rounded-[3rem] shadow-2xl relative overflow-hidden flex items-center justify-center group">
                                {user?.profileImage ? (
                                    <img
                                        src={getImageUrl(user.profileImage)}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt="Profile"
                                    />
                                ) : (
                                    <User className="w-20 h-20 text-gold-500/20 group-hover:scale-110 transition-transform duration-700" />
                                )}
                                <div className="absolute inset-0 border-4 border-white/20 rounded-[3rem]"></div>

                                {/* Overlay Upload Trigger */}
                                <label className="absolute inset-0 bg-emerald-950/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                                    <Camera className="w-8 h-8 text-gold-500 mb-2" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Update Portrait</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -bottom-4 -right-4 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-emerald-950/5"
                            >
                                <Shield className="w-6 h-6 text-emerald-900" />
                            </motion.div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl font-display text-emerald-950">{user?.name}</h1>
                            <p className="text-emerald-900/40 font-bold uppercase tracking-[0.3em] text-xs">Verified Guardian Since 2026</p>
                        </div>

                        <div className="pt-10 border-t border-emerald-950/5 space-y-6">
                            <Link to="/wishlist" className="flex items-center gap-5 group cursor-pointer">
                                <div className="w-12 h-12 bg-emerald-900/5 rounded-2xl flex items-center justify-center group-hover:bg-emerald-950 group-hover:text-gold-500 transition-all">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-emerald-950 uppercase tracking-widest">Saved Events</p>
                                    <p className="text-xs text-emerald-900/40 font-medium">
                                        {(wishlist.events?.length || 0) + (wishlist.places?.length || 0)} Items Saved
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 ml-auto text-emerald-900/20" />
                            </Link>
                            <div className="flex items-center gap-5 group cursor-pointer">
                                <div className="w-12 h-12 bg-emerald-900/5 rounded-2xl flex items-center justify-center group-hover:bg-emerald-950 group-hover:text-gold-500 transition-all">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-emerald-950 uppercase tracking-widest">Followed Regions</p>
                                    <p className="text-xs text-emerald-900/40 font-medium">
                                        {(followedDistricts?.length || 0) > 0 
                                            ? `${followedDistricts.length} Districts Tracked` 
                                            : 'No regions tracked yet'}
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 ml-auto text-emerald-900/20" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Identity & Interests */}
                    <div className="lg:col-span-8 space-y-16">
                        <section className="bg-white rounded-[4rem] p-12 shadow-2xl shadow-emerald-950/5 border border-emerald-950/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <Sparkles className="w-40 h-40 text-emerald-950" />
                            </div>

                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-3xl font-display text-emerald-950 italic">Personal <span className="text-gold-600">Identity.</span></h2>
                                <button
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-xs tracking-widest uppercase transition-all ${isEditing ? 'bg-gold-500 text-emerald-950 shadow-xl' : 'bg-emerald-900/5 text-emerald-900 hover:bg-emerald-950 hover:text-gold-500'}`}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <><Save className="w-4 h-4" /> Save Profile</> : 'Edit Profile'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/20 group-focus-within:text-gold-600" />
                                        <input
                                            disabled={!isEditing}
                                            className="w-full bg-emerald-900/5 border-transparent focus:bg-white focus:border-gold-500/50 rounded-2xl py-4 pl-14 pr-6 text-emerald-950 font-medium transition-all disabled:opacity-60"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] ml-1">Guardian Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/20" />
                                        <input
                                            disabled={true}
                                            className="w-full bg-emerald-900/5 border-transparent rounded-2xl py-4 pl-14 pr-6 text-emerald-900/30 font-medium cursor-not-allowed"
                                            value={formData.email}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] ml-1">Contact Number</label>
                                    <div className="flex gap-3">
                                        <div className="relative w-32 group">
                                            <select
                                                disabled={!isEditing}
                                                className="w-full bg-emerald-900/5 border-transparent focus:bg-white focus:border-gold-500/50 rounded-2xl py-4 px-4 text-emerald-950 font-black text-xs appearance-none transition-all disabled:opacity-60"
                                                value={formData.countryCode}
                                                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                            >
                                                {COUNTRY_CODES.map(c => (
                                                    <option key={c.code} value={c.code}>{c.country} ({c.code})</option>
                                                ))}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/20 pointer-events-none rotate-90" />
                                        </div>
                                        <div className="relative flex-grow group">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/20 group-focus-within:text-gold-600" />
                                            <input
                                                disabled={!isEditing}
                                                className="w-full bg-emerald-900/5 border-transparent focus:bg-white focus:border-gold-500/50 rounded-2xl py-4 pl-14 pr-6 text-emerald-950 font-medium transition-all disabled:opacity-60"
                                                placeholder="00000 00000"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-display text-emerald-950">Cultural <span className="text-gold-600 italic">Interests.</span></h2>
                                <p className="text-emerald-900/40 font-medium italic leading-relaxed">Select the threads of heritage that move your soul. We'll use these to curate your experience.</p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {CATEGORIES.map((cat) => {
                                    const isSelected = formData.interests.includes(cat);
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => handleInterestToggle(cat)}
                                            className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${isSelected
                                                    ? 'bg-emerald-950 text-gold-500 shadow-xl shadow-emerald-950/20'
                                                    : 'bg-white border border-emerald-900/5 text-emerald-950/60 hover:border-gold-500/30'
                                                }`}
                                        >
                                            {isSelected && <Check className="w-3 h-3" />}
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Heritage Support Chat */}
                        {user && (
                            <section className="py-16 border-t border-emerald-950/5">
                                <div className="bg-emerald-900 rounded-[3rem] p-10 md:p-14 relative overflow-hidden shadow-2xl shadow-emerald-900/40">
                                    {/* Decorative patterns */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                                    
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                                        <div className="space-y-4 text-center md:text-left">
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full">
                                                <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                                                <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Active Guardians Line</span>
                                            </div>
                                            <h3 className="text-4xl font-display text-white italic">Heritage <span className="text-gold-500">Support Portal.</span></h3>
                                            <p className="text-emerald-100/60 font-medium max-w-md leading-relaxed">
                                                {enquiries.some(enq => enq.status === 'replied') 
                                                    ? 'The guardians have responded to your enquiry. Step into the private chambers for a real-time dialogue.' 
                                                    : 'Establish a private line with our heritage curators for personalized journey assistance.'}
                                            </p>
                                        </div>
                                        
                                        <button 
                                            onClick={() => setShowChat(true)}
                                            className="group flex items-center gap-4 px-10 py-5 bg-gold-500 text-emerald-950 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-white transition-all shadow-xl shadow-gold-500/20"
                                        >
                                            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            Enter Portal
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {showChat && <SupportChat user={user} onClose={() => setShowChat(false)} />}

                        <section className="pt-16 border-t border-emerald-950/5">
                            <div className="bg-red-50/50 rounded-[3rem] p-12 border border-red-100/50 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-display text-emerald-950">Identity <span className="text-red-600 italic">Dissolution.</span></h3>
                                    <p className="text-emerald-900/40 text-xs font-medium max-w-md">Permanently purge your digital footprint and heritage vault from our chronicles. This action is irreversible.</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        if (window.confirm('Are you absolutely certain? This will permanently erase your heritage vault and identity from the chronicles.')) {
                                            try {
                                                await api.delete('/user/me');
                                                toast.success('Your identity has been purged.');
                                                // Wait a bit and then log out locally
                                                setTimeout(() => {
                                                    localStorage.removeItem('token');
                                                    localStorage.removeItem('user');
                                                    window.location.href = '/';
                                                }, 2000);
                                            } catch (err) {
                                                toast.error('Dissolution failed. The spirits are restless.');
                                            }
                                        }
                                    }}
                                    className="px-10 py-5 bg-white border border-red-200 text-red-600 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-900/5"
                                >
                                    Purge My Identity
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
