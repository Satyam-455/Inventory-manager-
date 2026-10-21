import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { Inventory, InventoryTransaction, TransactionType } from '../../types';
import { Package, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, History, Plus, Minus, Search } from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'STOCK' | 'TRANSACTIONS'>('STOCK');

  // Stock Adjustment Modal state
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [adjType, setAdjType] = useState<TransactionType>('IN');
  const [adjQuantity, setAdjQuantity] = useState<number>(5);
  const [adjNotes, setAdjNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInventoryData();
  }, []);

  async function loadInventoryData() {
    try {
      const inv = await inventoryService.getInventoryWithProducts();
      const txs = await inventoryService.getTransactions();
      setInventory(inv);
      setTransactions(txs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStockAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventory) return;
    setSubmitting(true);
    try {
      await inventoryService.updateStock(
        selectedInventory.battery_id,
        adjType,
        Number(adjQuantity),
        'MANUAL',
        undefined,
        adjNotes || `Manual stock adjustment: ${adjType}`
      );
      setSelectedInventory(null);
      setAdjNotes('');
      await loadInventoryData();
    } catch (err: any) {
      alert(err.message || 'Failed to update stock');
    } finally {
      setSubmitting(false);
    }
  };

  const lowStockCount = inventory.filter(i => i.stock_quantity <= i.low_stock_threshold).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Stock & Movement</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time stock levels, low-stock threshold alerts, stock-in adjustments, and transactional movement logs</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('STOCK')}
            className={`py-2 px-4 text-xs font-semibold rounded-xl border transition-all ${
              activeTab === 'STOCK' ? 'bg-brand-600 text-white border-brand-600 shadow' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Stock Levels ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('TRANSACTIONS')}
            className={`py-2 px-4 text-xs font-semibold rounded-xl border transition-all ${
              activeTab === 'TRANSACTIONS' ? 'bg-brand-600 text-white border-brand-600 shadow' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Movement History ({transactions.length})
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Attention: <strong className="font-extrabold">{lowStockCount} battery models</strong> are at or below their low-stock threshold! Restock immediately to prevent sales stockout.</span>
          </div>
        </div>
      )}

      {activeTab === 'STOCK' ? (
        /* Stock Levels Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Battery Product</th>
                  <th className="py-3 px-4">SKU / Category</th>
                  <th className="py-3 px-4 text-center">Current Stock</th>
                  <th className="py-3 px-4 text-center">Low Threshold</th>
                  <th className="py-3 px-4">Shelf Location</th>
                  <th className="py-3 px-4 text-center">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {inventory.map((item) => {
                  const isLow = item.stock_quantity <= item.low_stock_threshold;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{item.battery?.brand} {item.battery?.model}</span>
                        <span className="text-[11px] font-extrabold text-brand-600">{item.battery?.ah} Ah</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-slate-600 block">{item.battery?.sku}</span>
                        <span className="text-[10px] text-slate-400">{item.battery?.category}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold inline-block ${
                          isLow ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.stock_quantity} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                        {item.low_stock_threshold} units
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.location || 'Shelf A1'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedInventory(item);
                            setAdjType('IN');
                            setAdjQuantity(5);
                          }}
                          className="py-1 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          + Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Inventory Transaction Movement History Ledger */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Battery Product</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4">Reference / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(tx.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {tx.battery?.brand} {tx.battery?.model}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        tx.transaction_type === 'IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-extrabold text-slate-900 text-sm">
                      {tx.transaction_type === 'IN' ? `+${tx.quantity}` : `-${tx.quantity}`}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-semibold text-slate-800">{tx.reference_type}</span>: {tx.notes || 'No notes'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {selectedInventory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Adjust Inventory Stock</h2>
              <p className="text-xs text-brand-600 font-bold mt-0.5">
                {selectedInventory.battery?.brand} {selectedInventory.battery?.model} ({selectedInventory.battery?.ah} Ah)
              </p>
            </div>

            <form onSubmit={handleStockAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adjustment Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjType('IN')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border ${
                      adjType === 'IN' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    + Stock In (Purchase / Restock)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjType('OUT')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border ${
                      adjType === 'OUT' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    - Stock Out (Damage / Sale)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity Units *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjQuantity}
                  onChange={(e) => setAdjQuantity(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-extrabold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  value={adjNotes}
                  onChange={(e) => setAdjNotes(e.target.value)}
                  placeholder="e.g. Received shipment from distributor Exide Prayagraj"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInventory(null)}
                  className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2 px-4 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg shadow"
                >
                  {submitting ? 'Updating...' : 'Confirm Stock Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
