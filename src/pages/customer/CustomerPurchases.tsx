import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../lib/supabase';
import { saleService } from '../../services/saleService';
import { Sale } from '../../types';
import { ShoppingBag, FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

export const CustomerPurchases: React.FC = () => {
  const { customer } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPurchases() {
      if (!customer) return;
      const allSales = await saleService.getSalesWithDetails();
      const userSales = allSales.filter(s => s.customer_id === customer.id);
      setSales(userSales);
      setLoading(false);
    }
    loadPurchases();
  }, [customer]);

  const downloadInvoicePDF = (sale: Sale) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('POWERDRIVE BATTERY SOLUTIONS', 14, 20);
    doc.setFontSize(10);
    doc.text(`Customer Receipt - Invoice: ${sale.invoice_number}`, 14, 28);
    doc.text(`Date: ${new Date(sale.sale_date).toLocaleDateString('en-IN')}`, 14, 34);
    doc.text(`Total Amount Billed: Rs. ${sale.total_amount}`, 14, 42);
    doc.save(`Invoice_${sale.invoice_number}.pdf`);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-slate-900">My Purchases & Bills</h2>
        <p className="text-xs text-slate-500">History of digital invoices and receipts</p>
      </div>

      {sales.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
          <p>No purchase records found for your account.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sales.map((s) => (
            <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-brand-600 font-mono text-sm">{s.invoice_number}</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  {s.payment_method}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-600 block font-medium">
                  {s.items?.map(i => `${i.battery?.brand} ${i.battery?.model}`).join(', ') || 'Battery Purchase'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(s.sale_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <strong className="text-slate-900 text-base font-extrabold">₹{s.total_amount.toLocaleString('en-IN')}</strong>
                <button
                  onClick={() => downloadInvoicePDF(s)}
                  className="py-1 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Bill</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
