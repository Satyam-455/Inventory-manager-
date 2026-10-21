import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Phone, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('admin@batterypos.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(identifier, password);
      if (identifier.includes('admin') || identifier === '+919839012345') {
        navigate('/admin');
      } else {
        navigate('/customer');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'ADMIN' | 'CUSTOMER') => {
    setLoading(true);
    try {
      if (type === 'ADMIN') {
        await login('admin@batterypos.in');
        navigate('/admin');
      } else {
        await login('rahul.sharma@gmail.com');
        navigate('/customer');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
        <p className="text-sm text-slate-400 mt-1">Sign in to your battery management portal</p>
      </div>

      {/* Quick One-Click Demo Logins */}
      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
        <p className="text-xs font-bold text-brand-300 uppercase tracking-wider">Quick Demo Login</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('ADMIN')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Mode</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('CUSTOMER')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>Customer App</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Email or Registered Phone Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. +91 98765 43210 or admin@batterypos.in"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-slate-300">Password</label>
            <Link to="/forgot-password" className="text-xs text-brand-400 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-lg text-sm font-semibold shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-700/60">
        New Customer?{' '}
        <Link to="/register" className="text-brand-400 font-semibold hover:underline">
          Create customer profile
        </Link>
      </div>
    </div>
  );
};
