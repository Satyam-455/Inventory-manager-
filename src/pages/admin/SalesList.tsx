import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saleService } from '../../services/saleService';
import { Sale } from '../../types';
import { Search, FileText, PlusCircle, Calendar, CreditCard, ChevronRight } from 'lucide-react';

export const SalesList: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    try {
      const data = await saleService.getSalesWithDetails();
      setSales(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredSales = sales.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const matchesPayment = paymentFilter === 'ALL' || s.payment_method === paymentFilter;
    const matchesSearch = !q || (
      s.invoice_number.toLowerCase().includes(q) ||
      s.customer?.name.toLowerCase().includes(q) ||
      s.customer?.phone.includes(q)
    );
    return matchesPayment && matchesSearch;
  });

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total_amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales & Invoices Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">Complete record of shop transactions, payment methods, and invoices</p>
        </div>

        <Link
          to="/admin/sales/new"
          className="flex items-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Sales Counter Order</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice no, customer name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="NET_BANKING">Net Banking</option>
          </select>

          <div className="text-xs font-bold text-slate-900">
            Total Revenue: <span className="text-emerald-600 font-extrabold text-sm">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Items Billed</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Invoice PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brand-600 font-mono text-sm">{sale.invoice_number}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {new Date(sale.sale_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{sale.customer?.name}</span>
                    <span className="text-[11px] text-slate-400">{sale.customer?.phone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {sale.items?.map(i => `${i.battery?.brand} ${i.battery?.model} (${i.quantity}x)`).join(', ')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded text-[10px]">
                      {sale.payment_method}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 text-sm">
                    ₹{sale.total_amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      to={`/admin/sales/${sale.id}`}
                      className="py-1 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Invoice</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
