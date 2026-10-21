import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../lib/supabase';
import { Vehicle } from '../../types';
import { Car, Fuel, Calendar, ShieldCheck } from 'lucide-react';

export const CustomerVehicles: React.FC = () => {
  const { customer } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (!customer) return;
    const v = localDb.getVehicles().filter(item => item.customer_id === customer.id);
    setVehicles(v);
  }, [customer]);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-slate-900">My Registered Vehicles</h2>
        <p className="text-xs text-slate-500">Vehicles linked for battery warranty & service tracking</p>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <Car className="w-8 h-8 text-slate-300 mx-auto" />
          <p>No vehicles currently registered under your phone number.</p>
          <p className="text-[11px] text-slate-400">Ask the shop counter to link your vehicle during your next battery purchase!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-brand-600 font-mono text-sm tracking-wide bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                  {v.registration_number}
                </span>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  {v.fuel_type}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{v.make} {v.model}</h3>
                <p className="text-xs text-slate-500">{v.variant || 'Standard'} • {v.manufacturing_year || 'Year N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
