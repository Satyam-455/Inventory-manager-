import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { localDb } from '../../lib/supabase';
import { inventoryService } from '../../services/inventoryService';
import { Customer, Sale, Inventory, Warranty, Offer } from '../../types';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  ShieldCheck, 
  AlertTriangle, 
  PlusCircle, 
  UserPlus, 
  Battery, 
  Tag, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle,
  Clock,
  ChevronRight,
  FileText
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Inventory[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [totalBatteries, setTotalBatteries] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const custData = localDb.getCustomers();
        const salesData = localDb.getSales();
        const warrantyData = localDb.getWarranties();
        const lowStock = await inventoryService.getLowStockItems();
        const inventoryAll = localDb.getInventory();
        const totalStockCount = inventoryAll.reduce((acc, item) => acc + item.stock_quantity, 0);

        setCustomers(custData);
        setSales(salesData);
        setWarranties(warrantyData);
        setLowStockItems(lowStock);
        setTotalBatteries(totalStockCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.total_amount, 0);
  const activeWarrantiesCount = warranties.filter(w => w.status === 'ACTIVE').length;
  const expiringWarrantiesCount = warranties.filter(w => w.status === 'EXPIRING_SOON').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-brand-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="z-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-400/30 px-3 py-1 rounded-full text-xs font-semibold text-brand-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Store Status: Open & Processing
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">PowerDrive POS Dashboard</h1>
          <p className="text-sm text-slate-300 mt-1">Real-time shop performance, inventory alerts, and quick actions counter.</p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Link
            to="/admin/sales/new"
            className="flex items-center gap-2 py-3 px-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Sale (Counter)</span>
          </Link>
        </div>
      </div>

      {/* Top Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Customers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{customers.length}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Active profiles</p>
        </div>

        {/* Total Batteries in Stock */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Stock</span>
            <Package className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalBatteries}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Units available</p>
        </div>

        {/* Total Sales Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">₹{totalSalesRevenue.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">{sales.length} orders billed</p>
        </div>

        {/* Active Warranties */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Warranties</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{activeWarrantiesCount}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Verified active</p>
        </div>

        {/* Warranties Expiring Soon */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Expiring Soon</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{expiringWarrantiesCount}</div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Due within 30 days</p>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600">{lowStockItems.length}</div>
          <p className="text-[11px] text-rose-600 font-medium mt-1">Requires restock</p>
        </div>
      </div>

      {/* Quick Action Buttons Row */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Shop Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Link
            to="/admin/sales/new"
            className="flex items-center gap-3 p-3 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-xl transition-all font-semibold text-xs"
          >
            <div className="p-2 bg-brand-500 text-white rounded-lg">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span>New Sale</span>
          </Link>

          <Link
            to="/admin/customers?action=add"
            className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all font-semibold text-xs"
          >
            <div className="p-2 bg-emerald-500 text-white rounded-lg">
              <UserPlus className="w-4 h-4" />
            </div>
            <span>Add Customer</span>
          </Link>

          <Link
            to="/admin/batteries?action=add"
            className="flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl transition-all font-semibold text-xs"
          >
            <div className="p-2 bg-amber-500 text-white rounded-lg">
              <Battery className="w-4 h-4" />
            </div>
            <span>Add Battery</span>
          </Link>

          <Link
            to="/admin/inventory"
            className="flex items-center gap-3 p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl transition-all font-semibold text-xs"
          >
            <div className="p-2 bg-indigo-500 text-white rounded-lg">
              <Package className="w-4 h-4" />
            </div>
            <span>Stock In</span>
          </Link>

          <Link
            to="/admin/offers"
            className="flex items-center gap-3 p-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition-all font-semibold text-xs"
          >
            <div className="p-2 bg-rose-500 text-white rounded-lg">
              <Tag className="w-4 h-4" />
            </div>
            <span>Create Offer</span>
          </Link>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Counter Sales Ledger (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Sales Transactions</h2>
              <p className="text-xs text-slate-500">Latest completed counter sales & invoices</p>
            </div>
            <Link to="/admin/sales" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View All Ledger <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Invoice No.</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-brand-600">{sale.invoice_number}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 block">{sale.customer?.name || 'Walk-in'}</span>
                      <span className="text-[11px] text-slate-400">{sale.customer?.phone}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {new Date(sale.sale_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                        {sale.payment_method}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                      ₹{sale.total_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Link
                        to={`/admin/sales/${sale.id}`}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-600 inline-flex items-center"
                        title="View Invoice"
                      >
                        <FileText className="w-4 h-4 text-brand-600" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar Alerts Column (1 col) */}
        <div className="space-y-6">
          {/* Low Stock Warning Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Low Stock Warnings ({lowStockItems.length})</span>
              </div>
              <Link to="/admin/inventory" className="text-[11px] font-semibold text-brand-600">Restock</Link>
            </div>

            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">All battery products have healthy stock levels.</p>
            ) : (
              <div className="space-y-2.5">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="p-2.5 bg-rose-50/50 border border-rose-200/80 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{item.battery?.brand} {item.battery?.model}</span>
                      <span className="text-[11px] text-slate-500">Threshold: {item.low_stock_threshold} units</span>
                    </div>
                    <div className="text-right">
                      <span className="bg-rose-600 text-white font-extrabold px-2 py-0.5 rounded text-xs block">
                        {item.stock_quantity} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Warranty Expiries */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>Upcoming Warranty Expiries</span>
              </div>
              <Link to="/admin/warranties" className="text-[11px] font-semibold text-brand-600">View All</Link>
            </div>

            <div className="space-y-2.5">
              {warranties.slice(0, 3).map((w) => (
                <div key={w.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block">{w.customer?.name}</span>
                    <span className="text-[11px] text-slate-500">{w.warranty_code}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    w.status === 'EXPIRING_SOON' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
