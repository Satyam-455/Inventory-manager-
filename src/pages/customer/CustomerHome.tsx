import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../lib/supabase';
import { Vehicle, Warranty, Sale, BatteryProduct, Offer } from '../../types';
import { 
  ShieldCheck, 
  Car, 
  Battery, 
  ShoppingBag, 
  Tag, 
  ChevronRight, 
  PhoneCall, 
  AlertCircle, 
  CheckCircle,
  FileText,
  User
} from 'lucide-react';

export const CustomerHome: React.FC = () => {
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [batteries, setBatteries] = useState<BatteryProduct[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (!customer) return;
    const v = localDb.getVehicles().filter(item => item.customer_id === customer.id);
    const w = localDb.getWarranties().filter(item => item.customer_id === customer.id);
    const s = localDb.getSales().filter(item => item.customer_id === customer.id);
    const b = localDb.getBatteries();
    const off = localDb.getOffers().filter(item => item.is_active);

    setVehicles(v);
    setWarranties(w);
    setSales(s);
    setBatteries(b);
    setOffers(off);
  }, [customer]);

  const activeWarranty = warranties.find(w => w.status === 'ACTIVE' || w.status === 'EXPIRING_SOON');

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Customer Greeting Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 text-white flex items-center justify-center font-bold text-xl shadow-md">
            {customer?.name ? customer.name[0] : 'C'}
          </div>
          <div>
            <span className="text-xs text-brand-300 font-semibold uppercase tracking-wider block">Welcome Back</span>
            <h2 className="text-xl font-bold text-white tracking-tight">{customer?.name || 'Valued Customer'}</h2>
            <p className="text-[11px] text-slate-300">{customer?.phone}</p>
          </div>
        </div>
      </div>

      {/* Active Digital Warranty Badge */}
      {activeWarranty ? (
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-2xl shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
              <span className="text-xs font-bold uppercase tracking-wider">Active Battery Warranty</span>
            </div>
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-white/30">
              Verified
            </span>
          </div>

          <div className="border-t border-emerald-500/50 pt-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-100 block">Warranty Registration Code</span>
              <strong className="text-white font-mono text-sm">{activeWarranty.warranty_code}</strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-100 block">Valid Until</span>
              <strong className="text-white text-xs">{activeWarranty.expiry_date}</strong>
            </div>
          </div>

          <Link
            to="/customer/warranty"
            className="block text-center py-2 bg-white text-emerald-800 text-xs font-extrabold rounded-xl shadow hover:bg-emerald-50 transition-colors"
          >
            View Digital Warranty Card →
          </Link>
        </div>
      ) : (
        <div className="bg-slate-100 border border-slate-200 p-4 rounded-2xl text-center space-y-1">
          <p className="text-xs text-slate-600 font-semibold">No active warranty card linked to this account.</p>
          <p className="text-[11px] text-slate-400">Purchased battery warranties automatically appear here.</p>
        </div>
      )}

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/customer/vehicles"
          className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-card hover:shadow-card-hover transition-all flex items-center gap-3"
        >
          <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">My Vehicles</span>
            <span className="text-[10px] text-slate-400">{vehicles.length} registered</span>
          </div>
        </Link>

        <Link
          to="/customer/purchases"
          className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-card hover:shadow-card-hover transition-all flex items-center gap-3"
        >
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">My Orders</span>
            <span className="text-[10px] text-slate-400">{sales.length} bills</span>
          </div>
        </Link>
      </div>

      {/* Customer Registered Vehicles Summary */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Car className="w-4 h-4 text-brand-500" />
            <span>My Registered Vehicles</span>
          </h3>
          <Link to="/customer/vehicles" className="text-[11px] font-semibold text-brand-600">View All</Link>
        </div>

        {vehicles.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No vehicles linked to profile.</p>
        ) : (
          <div className="space-y-2">
            {vehicles.map((v) => (
              <div key={v.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-brand-600 font-mono text-xs">{v.registration_number}</span>
                  <span className="text-xs font-bold text-slate-900 block">{v.make} {v.model}</span>
                </div>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  {v.fuel_type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promotional Offers Carousel / List */}
      {offers.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-rose-500" />
              <span>Special Battery Shop Offers</span>
            </h3>
            <Link to="/customer/offers" className="text-[11px] font-semibold text-brand-600">View All</Link>
          </div>

          <div className="space-y-2">
            {offers.slice(0, 2).map((off) => (
              <div key={off.id} className="p-3 bg-rose-50/60 border border-rose-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">{off.title}</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Code: {off.code}</span>
                </div>
                <span className="text-xs font-extrabold text-rose-600 bg-white px-2 py-1 rounded shadow-sm border border-rose-200">
                  Flat ₹{off.discount_value} OFF
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shop Contact Support Card */}
      <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-white block">Need Battery Service or Replacement?</span>
          <span className="text-[11px] text-slate-400">Call PowerDrive Prayagraj Helpline</span>
        </div>
        <a
          href="tel:+919839012345"
          className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 shadow"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call Shop</span>
        </a>
      </div>
    </div>
  );
};
