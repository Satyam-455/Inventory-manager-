import React, { useEffect, useState } from 'react';
import { localDb } from '../../lib/supabase';
import { BatteryProduct } from '../../types';
import { Battery, ShieldCheck, Tag, Zap } from 'lucide-react';

export const CustomerBatteries: React.FC = () => {
  const [batteries, setBatteries] = useState<BatteryProduct[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('ALL');

  useEffect(() => {
    setBatteries(localDb.getBatteries());
  }, []);

  const filtered = batteries.filter(b => selectedBrand === 'ALL' || b.brand === selectedBrand);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Battery Catalog & Fitment</h2>
        <p className="text-xs text-slate-500">Explore Exide, Amaron, and SF Sonic batteries available at PowerDrive</p>
      </div>

      {/* Brand Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['ALL', 'Exide', 'Amaron', 'SF Sonic'].map((brand) => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedBrand === brand ? 'bg-brand-600 text-white shadow' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {brand === 'ALL' ? 'All Brands' : brand}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((b) => (
          <div key={b.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 text-sm block">{b.brand} {b.model}</span>
                <span className="text-[11px] text-slate-500">Category: {b.category}</span>
              </div>
              <span className="bg-brand-100 text-brand-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {b.ah} Ah
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {b.warranty_months} Months Warranty
              </span>
              <strong className="text-slate-900 text-sm font-extrabold">₹{b.selling_price.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
