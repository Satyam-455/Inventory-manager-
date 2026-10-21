import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Battery, 
  ShieldCheck, 
  Car, 
  ShoppingCart, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Zap, 
  FileText,
  UserCheck,
  Building2,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async (role: 'ADMIN' | 'CUSTOMER') => {
    if (role === 'ADMIN') {
      await login('admin@batterypos.in');
      navigate('/admin');
    } else {
      await login('rahul.sharma@gmail.com');
      navigate('/customer');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center text-white shadow-lg">
              <Battery className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">PowerDrive</span>
              <span className="text-xs text-emerald-400 font-semibold block -mt-1">Battery Shop Manager</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuickDemo('CUSTOMER')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Customer Demo
            </button>

            <button
              onClick={() => handleQuickDemo('ADMIN')}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg shadow-md transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 text-brand-300 px-3 py-1 rounded-full text-xs font-medium mb-6">
          <Zap className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
          <span>Production Prototype for Indian Battery Retailers</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Complete Battery Shop Management & <span className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-transparent">Digital Warranty Platform</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Manage inventory stock, multi-step sales counter billing, automatic warranty code generation, digital PDF invoices, vehicle fitment lookup, and customer portal.
        </p>

        {/* Dual Role Call to Action Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
          {/* Admin Role Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-6 rounded-2xl shadow-2xl hover:border-brand-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">1. Admin / Shop Owner</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Full sales ledger, inventory stock management, vehicle fitment engine, multi-step counter sales, and warranty status monitoring.
              </p>
            </div>
            <button
              onClick={() => handleQuickDemo('ADMIN')}
              className="mt-6 w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Enter Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Customer Role Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-6 rounded-2xl shadow-2xl hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">2. Customer Portal</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Mobile-first portal for customers to track their vehicle registration, active battery warranty expiry date, and download digital invoices.
              </p>
            </div>
            <button
              onClick={() => handleQuickDemo('CUSTOMER')}
              className="mt-6 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Enter Customer App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-slate-950/60 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Built for High Performance Retail</h2>
            <p className="text-sm text-slate-400 mt-1">Realistic Indian battery shop workflow with Exide, Amaron, SF Sonic data models</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
              <ShoppingCart className="w-8 h-8 text-brand-400" />
              <h3 className="text-base font-bold text-white">Multi-Step Sales Workflow</h3>
              <p className="text-xs text-slate-400 leading-relaxed">7-step guided sales counter flow: Customer selection, vehicle fitment lookup, battery pick, discount, warranty calculation, and instant bill generation.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Automated Warranty Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Auto-calculated expiry dates, unique warranty codes (`WRN-EXD-78901`), and status filters (`ACTIVE`, `EXPIRING_SOON`, `EXPIRED`).</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
              <Car className="w-8 h-8 text-amber-400" />
              <h3 className="text-base font-bold text-white">Vehicle RC API Ready</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Extensible service abstraction (`vehicleLookupService`) ready to connect external CarInfo / Attestr RC APIs for instant vehicle detail autofill.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 PowerDrive Battery Shop Management Platform. Supabase RLS Protected.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-white">Sign In</Link>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
