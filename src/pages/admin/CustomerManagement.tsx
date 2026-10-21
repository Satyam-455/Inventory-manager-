import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { localDb } from '../../lib/supabase';
import { Customer, Vehicle } from '../../types';
import { Search, UserPlus, Phone, MapPin, ChevronRight, Car, FileText, User } from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showAddModal, setShowAddModal] = useState(searchParams.get('action') === 'add');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setCustomers(localDb.getCustomers());
    setVehicles(localDb.getVehicles());
  }

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `c_${Date.now()}`,
      name,
      phone,
      email,
      address,
      notes,
      created_at: new Date().toISOString()
    };
    const current = localDb.getCustomers();
    current.unshift(newCust);
    localDb.saveCustomers(current);

    setShowAddModal(false);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setNotes('');
    loadData();
  };

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    
    // Search by name, phone, email
    const matchesCust = c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email?.toLowerCase().includes(q);
    
    // Search by vehicle registration number linked to customer
    const matchesVehicle = vehicles.some(v => v.customer_id === c.id && v.registration_number.toLowerCase().includes(q));

    return matchesCust || matchesVehicle;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Manage shop customer profiles, vehicle registrations, and purchase history</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or vehicle reg (UP70AB1234)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredCustomers.length}</span> of {customers.length} customers
        </div>
      </div>

      {/* Customers Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone / Contact</th>
                <th className="py-3 px-4">Registered Vehicle</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                    No customers matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const custVehicles = vehicles.filter(v => v.customer_id === cust.id);
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link to={`/admin/customers/${cust.id}`} className="font-bold text-slate-900 hover:text-brand-600 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                            {cust.name[0]}
                          </div>
                          <span>{cust.name}</span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cust.phone}</span>
                        </div>
                        {cust.email && <span className="text-[11px] text-slate-400 block">{cust.email}</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        {custVehicles.length === 0 ? (
                          <span className="text-slate-400 italic text-[11px]">No vehicle linked</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {custVehicles.map(v => (
                              <span key={v.id} className="bg-slate-100 text-slate-800 border border-slate-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                                <Car className="w-3 h-3 text-slate-500" />
                                {v.registration_number} ({v.make})
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {cust.address || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          to={`/admin/customers/${cust.id}`}
                          className="inline-flex items-center gap-1 py-1 px-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-[11px] font-semibold border border-brand-200 transition-colors"
                        >
                          <span>View Profile</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Add New Customer</h2>
            <form onSubmit={handleAddCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Area, City"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Swift owner, regular customer"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg shadow"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
