import React, { useState, useEffect } from 'react';
import { localDb } from '../../lib/supabase';
import { Warranty, Customer, BatteryProduct } from '../../types';
import { ShieldCheck, Search, Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';

export const WarrantyManagement: React.FC = () => {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [batteries, setBatteries] = useState<BatteryProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setWarranties(localDb.getWarranties());
    setCustomers(localDb.getCustomers());
    setBatteries(localDb.getBatteries());
  }

  const filteredWarranties = warranties.filter(w => {
    const q = searchQuery.toLowerCase().trim();
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    const cust = customers.find(c => c.id === w.customer_id);
    const matchesSearch = !q || (
      w.warranty_code.toLowerCase().includes(q) ||
      cust?.name.toLowerCase().includes(q) ||
      cust?.phone.includes(q)
    );
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Warranty Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">Track battery warranty validity, expiry dates, and unique claim codes</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by warranty code (WRN-EXD-...), customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Warranty Statuses</option>
            <option value="ACTIVE">Active Coverage</option>
            <option value="EXPIRING_SOON">Expiring Soon (30 Days)</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Warranty Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Warranty Code</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Battery Installed</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredWarranties.map((w) => {
                const cust = customers.find(c => c.id === w.customer_id);
                const b = batteries.find(bat => bat.id === w.battery_id);
                return (
                  <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700 text-xs">
                      {w.warranty_code}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{cust?.name}</span>
                      <span className="text-[11px] text-slate-400">{cust?.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">
                      {b ? `${b.brand} ${b.model} (${b.ah} Ah)` : 'Battery SKU'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(w.start_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-bold">
                      {new Date(w.expiry_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        w.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : w.status === 'EXPIRING_SOON'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
