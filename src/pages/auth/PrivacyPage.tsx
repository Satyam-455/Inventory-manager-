import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="space-y-4 text-slate-300 text-xs leading-relaxed">
      <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
      <p>PowerDrive Battery Solutions is committed to safeguarding customer vehicle and warranty information. We store registration numbers, vehicle model details, and battery SKUs solely for managing billing and manufacturer warranty claims.</p>
      <h3 className="font-semibold text-slate-200 text-sm pt-2">1. Information We Collect</h3>
      <p>Name, phone number, vehicle registration number (e.g. UP70AB1234), and battery warranty codes.</p>
      <h3 className="font-semibold text-slate-200 text-sm pt-2">2. How Data is Secured</h3>
      <p>Data is stored securely on Supabase database with strict Row Level Security (RLS) policies guaranteeing that customers can only view their own purchases and warranty details.</p>
      <div className="pt-4 border-t border-slate-700">
        <Link to="/login" className="inline-flex items-center gap-1 text-brand-400 font-semibold hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
      </div>
    </div>
  );
};
