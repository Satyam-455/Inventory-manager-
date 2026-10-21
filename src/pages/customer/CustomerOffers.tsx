import React, { useEffect, useState } from 'react';
import { localDb } from '../../lib/supabase';
import { Offer } from '../../types';
import { Tag, Clock, CheckCircle } from 'lucide-react';

export const CustomerOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const active = localDb.getOffers().filter(o => o.is_active);
    setOffers(active);
  }, []);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Shop Offers & Coupons</h2>
        <p className="text-xs text-slate-500">Exclusive battery discount codes for online & counter billing</p>
      </div>

      <div className="space-y-3">
        {offers.map((off) => (
          <div key={off.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-brand-100 text-brand-800 text-xs font-mono font-extrabold px-3 py-1 rounded-full border border-brand-200">
                PROMO CODE: {off.code}
              </span>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {off.discount_type === 'FIXED' ? `Flat ₹${off.discount_value} OFF` : `${off.discount_value}% OFF`}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm">{off.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Show this code at the counter during battery billing!</p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Valid until {off.valid_until}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
