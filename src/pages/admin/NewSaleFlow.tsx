import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { localDb } from '../../lib/supabase';
import { batteryFitmentService } from '../../services/batteryFitmentService';
import { saleService } from '../../services/saleService';
import { Customer, Vehicle, BatteryProduct, Inventory } from '../../types';
import { 
  CheckCircle, 
  User, 
  Car, 
  Battery, 
  Tag, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  Plus, 
  Check, 
  AlertTriangle,
  Zap
} from 'lucide-react';

export const NewSaleFlow: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedCustId = searchParams.get('customer_id');
  const preselectedVehicleId = searchParams.get('vehicle_id');

  const [step, setStep] = useState<number>(1);

  // Data sources
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [batteries, setBatteries] = useState<BatteryProduct[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);

  // Selection states
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedBattery, setSelectedBattery] = useState<BatteryProduct | null>(null);

  // Sale form states
  const [quantity, setQuantity] = useState<number>(1);
  const [tradeInDiscount, setTradeInDiscount] = useState<number>(500); // Old battery scrap exchange
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'NET_BANKING'>('UPI');
  const [notes, setNotes] = useState('');

  // Quick Customer Creation inline state
  const [showQuickCustModal, setShowQuickCustModal] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');

  // Quick Vehicle Creation inline state
  const [showQuickVehModal, setShowQuickVehModal] = useState(false);
  const [vehRegNo, setVehRegNo] = useState('');
  const [vehMake, setVehMake] = useState('Maruti Suzuki');
  const [vehModel, setVehModel] = useState('');

  // Submission / Success state
  const [processing, setProcessing] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const custs = localDb.getCustomers();
    const vehs = localDb.getVehicles();
    const bats = localDb.getBatteries();
    const invs = localDb.getInventory();

    setCustomers(custs);
    setVehicles(vehs);
    setBatteries(bats);
    setInventory(invs);

    if (preselectedCustId) {
      const c = custs.find(item => item.id === preselectedCustId);
      if (c) setSelectedCustomer(c);
    }
    if (preselectedVehicleId) {
      const v = vehs.find(item => item.id === preselectedVehicleId);
      if (v) setSelectedVehicle(v);
    }
  }

  const handleQuickCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newC: Customer = {
      id: `c_${Date.now()}`,
      name: custName,
      phone: custPhone,
      address: custAddress,
      created_at: new Date().toISOString()
    };
    const updated = [newC, ...customers];
    localDb.saveCustomers(updated);
    setCustomers(updated);
    setSelectedCustomer(newC);
    setShowQuickCustModal(false);
    setCustName('');
    setCustPhone('');
  };

  const handleQuickCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const newV: Vehicle = {
      id: `v_${Date.now()}`,
      customer_id: selectedCustomer.id,
      registration_number: vehRegNo.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      make: vehMake,
      model: vehModel,
      fuel_type: 'Petrol',
      created_at: new Date().toISOString()
    };
    const updated = [newV, ...vehicles];
    localDb.saveVehicles(updated);
    setVehicles(updated);
    setSelectedVehicle(newV);
    setShowQuickVehModal(false);
    setVehRegNo('');
    setVehModel('');
  };

  // Recommended batteries based on selected vehicle fitment
  const recommendedBatteries = selectedVehicle
    ? batteryFitmentService.recommendForVehicle(selectedVehicle.model, batteries)
    : batteries;

  // Calculation helpers
  const unitPrice = selectedBattery?.selling_price || 0;
  const grossSubtotal = unitPrice * quantity;
  const netTotal = Math.max(0, grossSubtotal - tradeInDiscount);

  const handleCompleteSale = async () => {
    if (!selectedCustomer || !selectedBattery) return;
    setProcessing(true);

    try {
      const saleResult = await saleService.createNewSale({
        customer_id: selectedCustomer.id,
        vehicle_id: selectedVehicle?.id,
        battery_id: selectedBattery.id,
        quantity,
        trade_in_discount: tradeInDiscount,
        payment_method: paymentMethod,
        notes,
        created_by: 'admin-id'
      });

      setSaleSuccess(saleResult);
      setStep(7); // Final success step
    } catch (err: any) {
      alert(err.message || 'Failed to complete sale');
    } finally {
      setProcessing(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Customer' },
    { num: 2, label: 'Vehicle' },
    { num: 3, label: 'Battery Pick' },
    { num: 4, label: 'Billing' },
    { num: 5, label: 'Warranty' },
    { num: 6, label: 'Preview' },
    { num: 7, label: 'Complete' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Guided Progress Tracker Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
        <div className="flex items-center justify-between overflow-x-auto py-1">
          {stepsList.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2 min-w-max">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step > s.num
                      ? 'bg-emerald-500 text-white'
                      : step === s.num
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-semibold ${step === s.num ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
              {idx < stepsList.length - 1 && (
                <div className={`h-0.5 w-6 sm:w-12 mx-1 ${step > s.num ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: SELECT CUSTOMER */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Select Customer Profile</h2>
              <p className="text-xs text-slate-500">Pick an existing shop customer or quickly create a new profile</p>
            </div>
            <button
              onClick={() => setShowQuickCustModal(true)}
              className="py-2 px-3.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl border border-brand-200 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Quick Add Customer
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
            {customers.map((c) => {
              const isSelected = selectedCustomer?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-50/80 border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-brand-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{c.phone}</p>
                  {c.address && <p className="text-[10px] text-slate-400 truncate mt-0.5">{c.address}</p>}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              disabled={!selectedCustomer}
              onClick={() => setStep(2)}
              className="py-2.5 px-6 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2 disabled:opacity-50"
            >
              <span>Next: Select Vehicle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT / LOOKUP VEHICLE */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Select Customer Vehicle</h2>
              <p className="text-xs text-slate-500">
                Customer: <strong className="text-slate-900">{selectedCustomer?.name}</strong> ({selectedCustomer?.phone})
              </p>
            </div>
            <button
              onClick={() => setShowQuickVehModal(true)}
              className="py-2 px-3.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl border border-brand-200 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add New Vehicle
            </button>
          </div>

          {/* Customer's vehicles list */}
          <div className="space-y-3">
            {vehicles.filter(v => v.customer_id === selectedCustomer?.id).length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="text-xs text-slate-500">No vehicle linked to {selectedCustomer?.name}.</p>
                <button
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Skip vehicle selection & proceed directly to battery catalog →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicles.filter(v => v.customer_id === selectedCustomer?.id).map((v) => {
                  const isSelected = selectedVehicle?.id === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-50/80 border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-brand-600 text-xs font-mono">{v.registration_number}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-brand-600" />}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{v.make} {v.model}</h4>
                      <p className="text-[11px] text-slate-500">{v.fuel_type} • {v.variant || 'Standard'}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-6 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2"
            >
              <span>Next: Pick Recommended Battery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RECOMMEND & SELECT BATTERY */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Select Battery Product</h2>
              {selectedVehicle && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Showing recommended batteries for {selectedVehicle.make} {selectedVehicle.model}</span>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Batteries Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[30rem] overflow-y-auto p-1">
            {recommendedBatteries.map((b) => {
              const isSelected = selectedBattery?.id === b.id;
              const inv = inventory.find(i => i.battery_id === b.id);
              const stock = inv ? inv.stock_quantity : 0;
              const outOfStock = stock <= 0;

              return (
                <div
                  key={b.id}
                  onClick={() => !outOfStock && setSelectedBattery(b)}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    outOfStock ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'cursor-pointer'
                  } ${
                    isSelected
                      ? 'bg-brand-50/90 border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-slate-900 text-sm">{b.brand} {b.model}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-brand-600" />}
                    </div>

                    <div className="flex items-center gap-2 my-2">
                      <span className="bg-brand-100 text-brand-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                        {b.ah} Ah
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {b.warranty_months} Mo Warranty
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500">Category: {b.category}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {b.sku}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Selling Price</span>
                      <strong className="text-slate-900 text-sm font-extrabold">₹{b.selling_price.toLocaleString('en-IN')}</strong>
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      outOfStock ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {outOfStock ? 'Out of Stock' : `${stock} in stock`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={!selectedBattery}
              onClick={() => setStep(4)}
              className="py-2.5 px-6 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2 disabled:opacity-50"
            >
              <span>Next: Counter Billing Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SALE & PAYMENT DETAILS */}
      {step === 4 && selectedBattery && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 4: Billing & Trade-in Scrap Discount</h2>
            <p className="text-xs text-slate-500">
              Item: <strong className="text-slate-900">{selectedBattery.brand} {selectedBattery.model} ({selectedBattery.ah} Ah)</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Old Battery Exchange / Scrap Discount (₹)
                </label>
                <input
                  type="number"
                  value={tradeInDiscount}
                  onChange={(e) => setTradeInDiscount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-emerald-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">Deducted for customer returning old battery for recycling.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                  <option value="CASH">Cash Payment</option>
                  <option value="CARD">Debit / Credit Card</option>
                  <option value="NET_BANKING">Net Banking</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bill Notes / Counter Remarks</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Free terminal greasing & voltage check done"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                ></textarea>
              </div>
            </div>

            {/* Bill Summary Breakdown Card */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Counter Price Calculation</h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Unit Selling Price</span>
                    <span>₹{selectedBattery.selling_price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span>{quantity}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Subtotal</span>
                    <span className="font-semibold text-white">₹{grossSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Scrap Trade-in Discount</span>
                    <span>- ₹{tradeInDiscount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Final Bill Total</span>
                  <span className="text-2xl font-extrabold text-white">₹{netTotal.toLocaleString('en-IN')}</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-1 rounded font-bold uppercase">
                  GST Included
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(5)}
              className="py-2.5 px-6 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2"
            >
              <span>Next: Warranty Calculation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: AUTOMATED WARRANTY CALCULATION */}
      {step === 5 && selectedBattery && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 5: Automated Warranty Generation</h2>
            <p className="text-xs text-slate-500">Calculates coverage duration and creates verifiable customer warranty code</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/80 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {selectedBattery.warranty_months} Months Full Manufacturer Warranty
                </h3>
                <p className="text-xs text-emerald-800">
                  {selectedBattery.brand} Official Warranty Policy ({selectedBattery.warranty_months / 12} Years)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <span className="text-slate-400 block text-[10px]">Warranty Start Date</span>
                <strong className="text-slate-900 font-bold">{new Date().toLocaleDateString('en-IN')}</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <span className="text-slate-400 block text-[10px]">Coverage Duration</span>
                <strong className="text-emerald-600 font-bold">{selectedBattery.warranty_months} Months</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <span className="text-slate-400 block text-[10px]">Calculated Expiry Date</span>
                <strong className="text-slate-900 font-bold">
                  {new Date(Date.now() + selectedBattery.warranty_months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}
                </strong>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(4)}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(6)}
              className="py-2.5 px-6 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2"
            >
              <span>Next: Invoice Final Preview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: INVOICE PREVIEW & FINAL BREAKDOWN */}
      {step === 6 && selectedCustomer && selectedBattery && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 6: Review & Finalize Counter Sale</h2>
            <p className="text-xs text-slate-500">Confirm details before completing order and generating receipt</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-50/50">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Customer Info</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">{selectedCustomer.name}</h4>
                <p className="text-xs text-slate-600">{selectedCustomer.phone}</p>
              </div>

              {selectedVehicle && (
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Vehicle</span>
                  <h4 className="font-mono font-extrabold text-brand-600 text-sm mt-0.5">{selectedVehicle.registration_number}</h4>
                  <p className="text-xs text-slate-600">{selectedVehicle.make} {selectedVehicle.model}</p>
                </div>
              )}
            </div>

            <div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-2">Item Purchased</span>
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{selectedBattery.brand} {selectedBattery.model}</span>
                  <p className="text-slate-500 font-mono">{selectedBattery.ah} Ah • SKU: {selectedBattery.sku}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-900 font-bold block">{quantity}x @ ₹{selectedBattery.selling_price.toLocaleString('en-IN')}</span>
                  <span className="text-emerald-600 font-bold">Trade-in Disc: -₹{tradeInDiscount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-700">Total Payable ({paymentMethod})</span>
              <span className="text-2xl font-extrabold text-slate-900">₹{netTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(5)}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={processing}
              onClick={handleCompleteSale}
              className="py-3 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {processing ? 'Generating Bill & Warranty...' : 'Confirm & Complete Sale'}
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: SALE SUCCESS & DIGITAL BILL CONFIRMED */}
      {step === 7 && saleSuccess && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Sale Transaction Billed Successfully
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Invoice {saleSuccess.invoice?.invoice_number}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Stock decremented by {quantity} unit(s). Warranty code registered on customer portal.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-md mx-auto grid grid-cols-2 gap-3 text-xs text-left">
            <div>
              <span className="text-slate-400 block text-[10px]">Warranty Code Generated</span>
              <strong className="text-emerald-700 font-mono text-xs">{saleSuccess.warranty?.warranty_code}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Total Amount Paid</span>
              <strong className="text-slate-900 font-extrabold text-sm">₹{saleSuccess.sale?.total_amount.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate(`/admin/sales/${saleSuccess.sale.id}`)}
              className="py-3 px-6 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>View & Print Digital PDF Invoice</span>
            </button>
            <button
              onClick={() => {
                setStep(1);
                setSelectedBattery(null);
                setSaleSuccess(null);
              }}
              className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
            >
              Process Another Sale
            </button>
          </div>
        </div>
      )}

      {/* Quick Add Customer Modal */}
      {showQuickCustModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Quick Add Customer</h3>
            <form onSubmit={handleQuickCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Amit Verma"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  placeholder="Area, City"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickCustModal(false)}
                  className="py-2 px-4 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-brand-600 text-white text-xs font-semibold rounded-lg shadow"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Vehicle Modal */}
      {showQuickVehModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Vehicle for {selectedCustomer?.name}</h3>
            <form onSubmit={handleQuickCreateVehicle} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registration No. *</label>
                <input
                  type="text"
                  required
                  value={vehRegNo}
                  onChange={(e) => setVehRegNo(e.target.value)}
                  placeholder="e.g. UP70AB1234"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-bold text-brand-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Make</label>
                  <select
                    value={vehMake}
                    onChange={(e) => setVehMake(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Tata">Tata</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Honda">Honda</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={vehModel}
                    onChange={(e) => setVehModel(e.target.value)}
                    placeholder="Swift / Creta"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickVehModal(false)}
                  className="py-2 px-4 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-brand-600 text-white text-xs font-semibold rounded-lg shadow"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
