import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { saleService } from '../../services/saleService';
import { localDb } from '../../lib/supabase';
import { Sale, Warranty, Invoice } from '../../types';
import { jsPDF } from 'jspdf';
import { 
  FileText, 
  Printer, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle, 
  Building2, 
  User, 
  Car, 
  Battery
} from 'lucide-react';

export const SaleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sale, setSale] = useState<Sale | null>(null);
  const [warranty, setWarranty] = useState<Warranty | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaleDetail() {
      if (!id) return;
      const sales = await saleService.getSalesWithDetails();
      const s = sales.find(item => item.id === id);
      if (s) {
        setSale(s);
        const wList = localDb.getWarranties().filter(w => w.sale_id === s.id);
        if (wList.length > 0) setWarranty(wList[0]);
        const invList = localDb.getInvoices().filter(i => i.sale_id === s.id);
        if (invList.length > 0) setInvoice(invList[0]);
      }
      setLoading(false);
    }
    loadSaleDetail();
  }, [id]);

  const handleDownloadPDF = () => {
    if (!sale) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59); // Slate-900
    doc.text('POWERDRIVE BATTERY SOLUTIONS', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Authorized Battery Dealer & Service Counter', 14, 26);
    doc.text('GSTIN: 09ABCDE1234F1ZH | Phone: +91 98390 12345', 14, 31);

    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 36, 196, 36);

    // Invoice Meta
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235); // Brand blue
    doc.text(`INVOICE: ${sale.invoice_number}`, 14, 46);

    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`Date: ${new Date(sale.sale_date).toLocaleDateString('en-IN')}`, 140, 46);

    // Customer & Vehicle Details Box
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 52, 182, 30, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS', 18, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Name: ${sale.customer?.name || 'Walk-in'}`, 18, 67);
    doc.text(`Phone: ${sale.customer?.phone || 'N/A'}`, 18, 74);

    if (sale.vehicle) {
      doc.setFont('helvetica', 'bold');
      doc.text('VEHICLE DETAILS', 110, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(`Reg No: ${sale.vehicle.registration_number}`, 110, 67);
      doc.text(`Make/Model: ${sale.vehicle.make} ${sale.vehicle.model}`, 110, 74);
    }

    // Items Billed Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('PURCHASED ITEMS', 14, 94);

    doc.setFontSize(10);
    let y = 104;
    sale.items?.forEach((item, index) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${item.battery?.brand} ${item.battery?.model}`, 18, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`Qty: ${item.quantity}  x  Price: Rs.${item.unit_price}`, 18, y + 6);
      doc.text(`Rs.${item.total_price}`, 160, y + 6);
      y += 16;
    });

    // Summary Totals
    doc.line(14, y, 196, y);
    y += 10;
    doc.text(`Subtotal: Rs.${sale.subtotal || sale.subtotal_amount}`, 130, y);
    y += 6;
    const disc = sale.trade_in_discount || sale.discount_amount || 0;
    if (disc > 0) {
      doc.text(`Trade-in Scrap Discount: -Rs.${disc}`, 130, y);
      y += 6;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`TOTAL AMOUNT PAID: Rs.${sale.total_amount}`, 130, y);

    // Warranty Code Badge
    if (warranty) {
      y += 20;
      doc.setFillColor(236, 253, 245);
      doc.rect(14, y, 182, 20, 'F');
      doc.setTextColor(5, 150, 105);
      doc.setFontSize(10);
      doc.text(`OFFICIAL WARRANTY CODE: ${warranty.warranty_code}`, 20, y + 12);
    }

    // Save PDF file
    doc.save(`Invoice_${sale.invoice_number}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-sm text-slate-500">Sale invoice record not found.</p>
        <Link to="/admin/sales" className="text-xs text-brand-600 font-semibold hover:underline">
          Return to Sales Ledger
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <Link to="/admin/sales" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sales Ledger</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 py-2 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Digital PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Digital Invoice Document Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-12 space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center font-bold shadow-lg">
              <Battery className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">POWERDRIVE BATTERY SOLUTIONS</h1>
              <p className="text-xs text-slate-500 font-medium">Authorized Retailer & Official Warranty Service Center</p>
              <p className="text-[11px] text-slate-400">GSTIN: 09ABCDE1234F1ZH • Phone: +91 98390 12345</p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Retail Bill / Cash Memo</span>
            <span className="text-xl font-extrabold text-brand-600 font-mono">{sale.invoice_number}</span>
            <span className="text-xs text-slate-600 block mt-0.5">
              Date: {new Date(sale.sale_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Customer & Vehicle Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Billed To Customer</span>
            <h3 className="font-extrabold text-slate-900 text-sm">{sale.customer?.name}</h3>
            <p className="text-slate-600 mt-0.5">{sale.customer?.phone}</p>
            {sale.customer?.address && <p className="text-slate-500">{sale.customer?.address}</p>}
          </div>

          {sale.vehicle && (
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Vehicle Details</span>
              <h3 className="font-mono font-extrabold text-brand-600 text-sm">{sale.vehicle.registration_number}</h3>
              <p className="text-slate-600 mt-0.5">{sale.vehicle.make} {sale.vehicle.model}</p>
              <p className="text-slate-500">{sale.vehicle.fuel_type}</p>
            </div>
          )}
        </div>

        {/* Billed Items Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Itemized Billing Breakdown</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sale.items?.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{item.battery?.brand} {item.battery?.model}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{item.battery?.ah} Ah • SKU: {item.battery?.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">₹{item.unit_price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">₹{item.total_price.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculation Totals */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-4 border-t border-slate-200">
          <div>
            {warranty && (
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Warranty Registration</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Warranty Code: <strong className="text-emerald-700 font-mono">{warranty.warranty_code}</strong>
                </p>
                <p className="text-[11px] text-slate-500">Valid until {warranty.expiry_date}</p>
              </div>
            )}
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{(sale.subtotal || sale.subtotal_amount || 0).toLocaleString('en-IN')}</span>
            </div>
            {(sale.trade_in_discount || sale.discount_amount || 0) > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Scrap Trade-in Discount</span>
                <span>- ₹{(sale.trade_in_discount || sale.discount_amount || 0).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Payment Method</span>
              <span className="font-bold text-slate-900">{sale.payment_method}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
              <span>Grand Total Paid</span>
              <span className="text-xl text-brand-600">₹{sale.total_amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer Terms */}
        <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-400 text-center space-y-1">
          <p>Thank you for choosing PowerDrive Battery Solutions!</p>
          <p>Computer generated invoice. Subject to Prayagraj jurisdiction.</p>
        </div>
      </div>
    </div>
  );
};
