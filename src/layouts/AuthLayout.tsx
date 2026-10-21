import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Battery } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background glow styling */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center text-white shadow-xl">
            <Battery className="w-7 h-7" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-extrabold tracking-tight text-white block">PowerDrive</span>
            <span className="text-xs font-semibold text-brand-400 block tracking-wider uppercase">Battery Shop Management</span>
          </div>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <Outlet />
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 flex justify-center gap-4">
          <Link to="/privacy" className="hover:text-slate-200 underline">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-slate-200 underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
};
