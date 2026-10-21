import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { localDb } from '../../lib/supabase';
import { saleService } from '../../services/saleService';
import { Customer, Vehicle, Sale, Warranty, BatteryProduct } from '../../types';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Car, 
  Battery, 
  ShieldCheck, 
  PlusCircle, 
  FileText, 
  ArrowLeft,
  Calendar,
  Clock
} from 'lucide-react';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [batteries, setBatteries] = useState<BatteryProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Add vehicle state
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [regNo, setRegNo] = useState('');
  const [make, setMake] = useState('Maruti Suzuki');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'CNG' | 'EV'>('Petrol');

  useEffect(() => {
    loadCustomerData();
  }, [id]);

  async function loadCustomerData() {
    if (!id) return;
    const custs = localDb.getCustomers();
    const found = custs.find(c => c.id === id);
    setCustomer(found || null);

    const vList = localDb.getVehicles().filter(v => v.customer_id === id);
    setVehicles(vList);

    const sList = (await saleService.getSalesWithDetails()).filter(s => s.customer_id === id);
    setSales(sList);

    const wList = localDb.getWarranties().filter(w => w.customer_id === id);
    const bList = localDb.getBatteries();
    setWarranties(wList);
    setBatteries(bList);

    setLoading(false);
  }

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !regNo || !model) return;

    const newV: Vehicle = {
      id: `v_${Date.now()}`,
      customer_id: id,
      registration_number: regNo.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      make,
      model,
      variant,
      fuel_type: fuelType,
      created_at: new Date().toISOString()
    };

    const currentV = localDb.getVehicles();
    currentV.push(newV);
    localDb.saveVehicles(currentV);

    setShowAddVehicle(false);
    setRegNo('');
    setModel('');
    setVariant('');
    loadCustomerData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-sm text-slate-500">Customer record not found.</p>
        <Link to="/admin/customers" className="text-xs text-brand-600 font-semibold hover:underline">
          Return to Customer Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/admin/customers" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customers</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/sales/new?customer_id=${customer.id}`)}
            className="flex items-center gap-1.5 py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Sale for {customer.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Customer Header Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg">
            {customer.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-500" />
                <strong className="text-slate-800">{customer.phone}</strong>
              </span>
              {customer.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {customer.email}
                </span>
              )}
              {customer.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {customer.address}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Total Purchases</span>
            <span className="text-lg font-extrabold text-slate-900">{sales.length} Bills</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Active Warranties</span>
            <span className="text-lg font-extrabold text-emerald-600">
              {warranties.filter(w => w.status === 'ACTIVE').length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Grid Section: Vehicles & Current Battery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Linked Vehicles Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Car className="w-4 h-4 text-brand-500" />
              <span>Registered Vehicles ({vehicles.length})</span>
            </div>
            <button
              onClick={() => setShowAddVehicle(true)}
              className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
            >
              + Add Vehicle
            </button>
          </div>

          {vehicles.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">No registered vehicles linked to customer.</p>
          ) : (
            <div className="space-y-3">
              {vehicles.map((v) => (
                <div key={v.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-brand-600 text-sm block">{v.registration_number}</span>
                    <span className="text-xs font-semibold text-slate-900">{v.make} {v.model} {v.variant}</span>
                    <span className="text-[11px] text-slate-500 block">{v.fuel_type} • {v.manufacturing_year || 'Year N/A'}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/sales/new?customer_id=${customer.id}&vehicle_id=${v.id}`)}
                    className="py-1 px-2.5 bg-brand-600 text-white rounded-lg text-[11px] font-semibold hover:bg-brand-500 shadow"
                  >
                    Select for Sale
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Battery & Warranty Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Battery className="w-4 h-4 text-emerald-500" />
              <span>Active Installed Battery & Warranty</span>
            </div>
          </div>

          {warranties.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">No active battery warranties linked.</p>
          ) : (
            <div className="space-y-3">
              {warranties.map((w) => {
                const b = batteries.find(bat => bat.id === w.battery_id);
                return (
                  <div key={w.id} className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{b?.brand} {b?.model} ({b?.ah} Ah)</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        w.status === 'ACTIVE' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {w.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-emerald-200/60 pt-2">
                      <div>
                        <span className="text-slate-400 block">Warranty Code</span>
                        <strong className="text-slate-800 font-mono">{w.warranty_code}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Expiry Date</span>
                        <strong className="text-slate-800">{w.expiry_date}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Customer Complete Purchase Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Purchase History & Billing Ledger</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Invoice No.</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Items Purchased</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3 text-right">Total Amount</th>
                <th className="py-2.5 px-3 text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 italic">No purchase history recorded for this customer.</td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-brand-600">{sale.invoice_number}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {new Date(sale.sale_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-3">
                      {sale.items?.map(i => `${i.battery?.brand} ${i.battery?.model} (${i.quantity}x)`).join(', ') || 'Battery Product'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                        {sale.payment_method}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                      ₹{sale.total_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Link
                        to={`/admin/sales/${sale.id}`}
                        className="p-1.5 hover:bg-slate-100 rounded text-brand-600 inline-flex items-center"
                        title="View Digital Invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Add Vehicle for {customer.name}</h2>
            <form onSubmit={handleAddVehicle} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Number *</label>
                <input
                  type="text"
                  required
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="e.g. UP70AB1234"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-bold text-brand-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Make *</label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Tata">Tata</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Honda">Honda</option>
                    <option value="Toyota">Toyota</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Swift / Creta"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Variant</label>
                  <input
                    type="text"
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    placeholder="e.g. VXi / SX"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="EV">EV</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
                  className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg shadow"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
