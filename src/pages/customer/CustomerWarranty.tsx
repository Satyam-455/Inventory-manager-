import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../lib/supabase';
import { Warranty, BatteryProduct } from '../../types';
import { ShieldCheck, CheckCircle, Clock, AlertTriangle, PhoneCall } from 'lucide-react';

export const CustomerWarranty: React.FC = () => {
  const { customer } = useAuth();
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [batteries, setBatteries] = useState<BatteryProduct[]>([]);

  useEffect(() => {
    if (!customer) return;
    const w = localDb.getWarranties().filter(item => item.customer_id === customer.id);
    const b = localDb.getBatteries();
    setWarranties(w);
    setBatteries(b);
  }, [customer]);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Digital Warranty Cards</h2>
        <p className="text-xs text-slate-500">Official manufacturer warranty tracking & claim verification</p>
      </div>

      {warranties.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
          <p>No active battery warranties linked to your profile.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {warranties.map((w) => {
            const bat = batteries.find(b => b.id === w.battery_id);
            return (
              <div key={w.id} className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-xl space-y-4 relative overflow-hidden border border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Verified Coverage</span>
                      <h3 className="font-extrabold text-white text-sm">{bat?.brand} {bat?.model}</h3>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    w.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {w.status}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 font-mono text-xs text-emerald-400 flex justify-between items-center">
                  <span>WARRANTY CODE:</span>
                  <strong className="text-sm font-extrabold">{w.warranty_code}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 border-t border-slate-700/60 pt-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Coverage Duration</span>
                    <strong className="text-white">{bat?.warranty_months} Months</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Expiry Date</span>
                    <strong className="text-white">{w.expiry_date}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="tel:+919839012345"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Claim Warranty Support</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
