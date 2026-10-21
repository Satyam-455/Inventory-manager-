import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { localDb } from '../../lib/supabase';
import { BatteryProduct, Inventory } from '../../types';
import { Battery, Search, PlusCircle, Filter, ShieldCheck, Tag, AlertTriangle } from 'lucide-react';

export const BatteryCatalog: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [batteries, setBatteries] = useState<BatteryProduct[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(searchParams.get('action') === 'add');

  // Form state
  const [brand, setBrand] = useState('Exide');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState<'Four Wheeler' | 'Two Wheeler' | 'Commercial Heavy' | 'Inverter Tall Tubular'>('Four Wheeler');
  const [ah, setAh] = useState(35);
  const [purchasePrice, setPurchasePrice] = useState(3500);
  const [sellingPrice, setSellingPrice] = useState(4800);
  const [warrantyMonths, setWarrantyMonths] = useState(60);
  const [sku, setSku] = useState('');
  const [initialStock, setInitialStock] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setBatteries(localDb.getBatteries());
    setInventory(localDb.getInventory());
  }

  const handleAddBattery = (e: React.FormEvent) => {
    e.preventDefault();
    const batteryId = `b_${Date.now()}`;
    const generatedSku = sku.trim().toUpperCase() || `${brand.substring(0, 3).toUpperCase()}-${model.replace(/[^A-Z0-9]/gi, '').substring(0, 6).toUpperCase()}-${ah}AH`;

    const newBattery: BatteryProduct = {
      id: batteryId,
      brand,
      model,
      category,
      ah: Number(ah),
      purchase_price: Number(purchasePrice),
      selling_price: Number(sellingPrice),
      warranty_months: Number(warrantyMonths),
      sku: generatedSku,
      is_active: true,
      created_at: new Date().toISOString()
    };

    const currentB = localDb.getBatteries();
    currentB.unshift(newBattery);
    localDb.saveBatteries(currentB);

    // Create Initial Inventory Record
    const currentInv = localDb.getInventory();
    currentInv.unshift({
      id: `inv_${Date.now()}`,
      battery_id: batteryId,
      stock_quantity: Number(initialStock),
      low_stock_threshold: 4,
      location: 'Main Shelf',
      updated_at: new Date().toISOString()
    });
    localDb.saveInventory(currentInv);

    setShowAddModal(false);
    setModel('');
    setSku('');
    loadData();
  };

  const filteredBatteries = batteries.filter(b => {
    const q = searchQuery.toLowerCase().trim();
    const matchesBrand = selectedBrand === 'ALL' || b.brand === selectedBrand;
    const matchesCategory = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchesSearch = !q || (
      b.brand.toLowerCase().includes(q) ||
      b.model.toLowerCase().includes(q) ||
      b.sku.toLowerCase().includes(q) ||
      b.ah.toString().includes(q)
    );
    return matchesBrand && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Battery Product Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Manage battery models, SKUs, pricing, warranty periods, and active status</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Battery Product</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search brand, model, SKU, Ah capacity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Brands (Exide, Amaron...)</option>
            <option value="Exide">Exide</option>
            <option value="Amaron">Amaron</option>
            <option value="SF Sonic">SF Sonic</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Categories</option>
            <option value="Four Wheeler">Four Wheeler</option>
            <option value="Two Wheeler">Two Wheeler</option>
            <option value="Commercial Heavy">Commercial Heavy</option>
            <option value="Inverter Tall Tubular">Inverter</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Brand & Model</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Ah Capacity</th>
                <th className="py-3 px-4">Warranty</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-center">In Stock</th>
                <th className="py-3 px-4 text-center">SKU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBatteries.map((b) => {
                const invItem = inventory.find(i => i.battery_id === b.id);
                const stock = invItem ? invItem.stock_quantity : 0;
                const isLow = invItem && stock <= invItem.low_stock_threshold;

                return (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{b.brand} {b.model}</span>
                      <span className="text-[11px] text-slate-400">Purchased: ₹{b.purchase_price}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{b.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-brand-600 text-sm">{b.ah} Ah</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded text-[10px]">
                        {b.warranty_months} Months ({b.warranty_months / 12} Yrs)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 text-sm">
                      ₹{b.selling_price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        isLow ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {b.sku}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Battery Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <h2 className="text-lg font-bold text-slate-900">Add New Battery Model</h2>
            <form onSubmit={handleAddBattery} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand *</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Exide">Exide</option>
                    <option value="Amaron">Amaron</option>
                    <option value="SF Sonic">SF Sonic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Model Name *</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Matrix Red MTRED35L"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Four Wheeler">Four Wheeler</option>
                    <option value="Two Wheeler">Two Wheeler</option>
                    <option value="Commercial Heavy">Commercial Heavy</option>
                    <option value="Inverter Tall Tubular">Inverter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ah Rating *</label>
                  <input
                    type="number"
                    required
                    value={ah}
                    onChange={(e) => setAh(Number(e.target.value))}
                    placeholder="35 / 45 / 65"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Price ₹</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price ₹ *</label>
                  <input
                    type="number"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Warranty (Months)</label>
                  <input
                    type="number"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SKU Code (Auto or Custom)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="EXD-MTR-35L"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    value={initialStock}
                    onChange={(e) => setInitialStock(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
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
                  Save Battery Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
