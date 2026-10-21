import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { localDb } from '../../lib/supabase';
import { vehicleLookupService } from '../../services/vehicleLookupService';
import { Vehicle, Customer } from '../../types';
import { Car, Search, Zap, CheckCircle, User, Phone, PlusCircle, ArrowRight } from 'lucide-react';

export const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // RC Lookup test state
  const [rcInput, setRcInput] = useState('UP70AB1234');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookingUp, setLookingUp] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setVehicles(localDb.getVehicles());
    setCustomers(localDb.getCustomers());
  }

  const handleRcLookupTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rcInput.trim()) return;
    setLookingUp(true);
    try {
      const res = await vehicleLookupService.lookupByRegistrationNumber(rcInput);
      setLookupResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLookingUp(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const cust = customers.find(c => c.id === v.customer_id);
    return (
      v.registration_number.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      cust?.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vehicle Registry</h1>
          <p className="text-xs text-slate-500 mt-1">Customer vehicle records & CarInfo / Attestr RC API lookup testing</p>
        </div>
      </div>

      {/* RC Lookup API Extensibility Demo Box */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 text-white p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>Extensible RC Lookup API Service (Attestr / CarInfo Ready)</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded font-bold">
            API Abstracted
          </span>
        </div>

        <form onSubmit={handleRcLookupTest} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Car className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={rcInput}
              onChange={(e) => setRcInput(e.target.value)}
              placeholder="Enter Registration Number (e.g. UP70AB1234)..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white uppercase placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={lookingUp}
            className="py-2.5 px-5 bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold rounded-xl shadow flex items-center justify-center gap-2"
          >
            {lookingUp ? 'Querying Vahan / RC API...' : 'Test RC API Lookup'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {lookupResult && (
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>RC Verification Success (Mocked Response)</span>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">Service Boundary: vehicleLookupService</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px]">Registration</span>
                <strong className="text-white font-mono text-xs">{lookupResult.registrationNumber}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Vehicle Make & Model</span>
                <strong className="text-white">{lookupResult.make} {lookupResult.model}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Fuel Type</span>
                <strong className="text-white">{lookupResult.fuelType}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Owner Name</span>
                <strong className="text-white">{lookupResult.ownerName || 'Verified'}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicle reg, make, model, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Registered Vehicles: <span className="font-bold text-slate-900">{filteredVehicles.length}</span>
        </div>
      </div>

      {/* Vehicle Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Registration No.</th>
                <th className="py-3 px-4">Make & Model</th>
                <th className="py-3 px-4">Fuel Type</th>
                <th className="py-3 px-4">Customer Owner</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredVehicles.map((v) => {
                const cust = customers.find(c => c.id === v.customer_id);
                return (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-brand-600 font-mono text-sm">{v.registration_number}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{v.make} {v.model}</span>
                      <span className="text-[11px] text-slate-500">{v.variant || 'Standard'} ({v.manufacturing_year || 'N/A'})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                        {v.fuel_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {cust ? (
                        <Link to={`/admin/customers/${cust.id}`} className="hover:text-brand-600">
                          <span className="font-bold text-slate-900 block">{cust.name}</span>
                          <span className="text-[11px] text-slate-400">{cust.phone}</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        to={`/admin/sales/new?customer_id=${cust?.id}&vehicle_id=${v.id}`}
                        className="py-1 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors"
                      >
                        New Sale
                      </Link>
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
