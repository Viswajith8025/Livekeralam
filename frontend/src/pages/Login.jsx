import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      window.dispatchEvent(new Event('authChange')); 
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f6f1] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl shadow-emerald-950/5 border border-white overflow-hidden relative z-10">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-900 rounded-[2rem] mb-6 ring-8 ring-emerald-50/50">
              <LogIn className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-display font-black text-emerald-950">Welcome Back</h1>
            <p className="text-emerald-900/60 mt-3 font-medium italic">Sign in to the LiveKeralam experience</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within:text-emerald-950 transition-colors w-5 h-5" />
                <input
                  type="email"
                  required
                  className="w-full bg-emerald-900/5 border-transparent focus:bg-white focus:border-emerald-950 focus:ring-4 focus:ring-emerald-950/5 rounded-2xl py-3.5 pl-12 pr-4 transition-all text-emerald-950 font-medium"
                  placeholder="admin@livekeralam.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-emerald-950/70 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within:text-emerald-950 transition-colors w-5 h-5" />
                <input
                  type="password"
                  required
                  className="w-full bg-emerald-900/5 border-transparent focus:bg-white focus:border-emerald-950 focus:ring-4 focus:ring-emerald-950/5 rounded-2xl py-3.5 pl-12 pr-4 transition-all text-emerald-950 font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-heritage-gradient text-gold-500 font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-950/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4 hover:scale-[1.02]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ENTER EXPERIENCE'}
            </button>
          </form>

          <p className="text-center text-emerald-900/50 mt-8 text-sm font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-950 font-black hover:text-gold-600 transition-colors">
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
