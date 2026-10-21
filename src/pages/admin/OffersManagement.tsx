import React, { useState, useEffect } from 'react';
import { localDb } from '../../lib/supabase';
import { Offer } from '../../types';
import { Tag, Plus, CheckCircle, Clock } from 'lucide-react';

export const OffersManagement: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [discountValue, setDiscountValue] = useState(500);

  useEffect(() => {
    setOffers(localDb.getOffers());
  }, []);

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: Offer = {
      id: `off_${Date.now()}`,
      title,
      code: code.toUpperCase() || `SAVE${discountValue}`,
      discount_type: discountType,
      discount_value: Number(discountValue),
      is_active: true,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    const updated = [newOffer, ...offers];
    localDb.saveOffers(updated);
    setOffers(updated);
    setShowAddModal(false);
    setTitle('');
    setCode('');
  };

  const toggleOfferActive = (id: string) => {
    const updated = offers.map(o => o.id === id ? { ...o, is_active: !o.is_active } : o);
    localDb.saveOffers(updated);
    setOffers(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Promotional Offers & Discounts</h1>
          <p className="text-xs text-slate-500 mt-1">Manage battery shop seasonal discount codes & trade-in promotions</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 shadow-card transition-all ${
              offer.is_active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-brand-100 text-brand-800 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border border-brand-200">
                  {offer.code}
                </span>
                <button
                  onClick={() => toggleOfferActive(offer.id)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    offer.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {offer.is_active ? 'Active' : 'Disabled'}
                </button>
              </div>

              <h3 className="font-bold text-slate-900 text-base mt-2">{offer.title}</h3>
              <p className="text-xs text-emerald-600 font-extrabold mt-1">
                {offer.discount_type === 'FIXED' ? `Flat ₹${offer.discount_value} OFF` : `${offer.discount_value}% OFF`}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Valid until {offer.valid_until}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create Shop Offer</h3>
            <form onSubmit={handleAddOffer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Monsoon Exide Battery Offer"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="MONSOON500"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-brand-600 text-white text-xs font-semibold rounded-lg shadow"
                >
                  Create Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
