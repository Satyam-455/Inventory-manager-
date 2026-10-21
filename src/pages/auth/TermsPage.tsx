import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="space-y-4 text-slate-300 text-xs leading-relaxed">
      <h2 className="text-xl font-bold text-white">Terms of Service</h2>
      <p>By using PowerDrive Battery Shop Management System, shop owners and customers agree to electronic invoice and digital warranty tracking terms.</p>
      <h3 className="font-semibold text-slate-200 text-sm pt-2">1. Warranty Coverage</h3>
      <p>Battery manufacturer warranty terms (e.g. Exide 72 months, Amaron 60 months) are subject to original warranty code verification at authorized service counters.</p>
      <h3 className="font-semibold text-slate-200 text-sm pt-2">2. Digital Invoices</h3>
      <p>Digital receipts generated in system serve as valid proof of purchase under standard retail billing guidelines.</p>
      <div className="pt-4 border-t border-slate-700">
        <Link to="/login" className="inline-flex items-center gap-1 text-brand-400 font-semibold hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
      </div>
    </div>
  );
};
