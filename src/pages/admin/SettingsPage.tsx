import React, { useState } from 'react';
import { Building2, FileText, Phone, Mail, MapPin, Save, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [shopName, setShopName] = useState('PowerDrive Battery Solutions');
  const [gstin, setGstin] = useState('09ABCDE1234F1ZH');
  const [phone, setPhone] = useState('+91 98390 12345');
  const [email, setEmail] = useState('contact@powerdrivebattery.in');
  const [address, setAddress] = useState('12/A Civil Lines, Near Subhash Chauraha, Prayagraj, UP - 211001');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Shop Settings & Invoice Branding</h1>
        <p className="text-xs text-slate-500 mt-1">Configure business profile, GSTIN tax details, and digital PDF receipt header</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6">
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Shop settings updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Battery Shop Name *</label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN Tax Registration Number</label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-brand-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Shop Helpline Phone *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Store Address</label>
          <textarea
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          ></textarea>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="py-2.5 px-6 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
