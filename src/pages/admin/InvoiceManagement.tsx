import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { localDb } from '../../lib/supabase';
import { Invoice, Sale, Customer } from '../../types';
import { FileText, Search, Download, Printer } from 'lucide-react';

export const InvoiceManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setInvoices(localDb.getInvoices());
    setSales(localDb.getSales());
    setCustomers(localDb.getCustomers());
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Digital Invoices</h1>
        <p className="text-xs text-slate-500 mt-1">Generated GST customer bills and digital PDF exports</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice Number</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4 text-right">Total Billed</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {invoices.map((inv) => {
                const s = sales.find(sale => sale.id === inv.sale_id);
                const c = customers.find(cust => cust.id === s?.customer_id);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-600">{inv.invoice_number}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c?.name || 'Customer'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{new Date(inv.issue_date || inv.created_at || Date.now()).toLocaleDateString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">₹{inv.total_amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        to={`/admin/sales/${inv.sale_id}`}
                        className="py-1 px-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-lg text-[11px] font-bold"
                      >
                        View & Export PDF
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
