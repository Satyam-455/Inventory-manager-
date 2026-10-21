import { localDb } from '../lib/supabase';
import { inventoryService } from './inventoryService';
import { Sale, SaleItem, Warranty, Invoice, PaymentMethod, PaymentStatus, Customer, Vehicle, BatteryProduct } from '../types';

export interface CreateSaleInput {
  customerId?: string;
  customer_id?: string;
  vehicleId?: string;
  vehicle_id?: string;
  batteryId?: string;
  battery_id?: string;
  quantity: number;
  unitPrice?: number;
  trade_in_discount?: number;
  discountAmount?: number;
  discount_amount?: number;
  taxAmount?: number;
  tax_amount?: number;
  paymentMethod?: PaymentMethod;
  payment_method?: any;
  notes?: string;
  warrantyMonths?: number;
  created_by?: string;
}

export const saleService = {
  async getSalesWithDetails(): Promise<Sale[]> {
    const sales = localDb.getSales();
    const customers = localDb.getCustomers();
    const vehicles = localDb.getVehicles();
    const saleItems = localDb.getSaleItems();
    const batteries = localDb.getBatteries();

    return sales
      .map(sale => {
        const items = saleItems
          .filter(item => item.sale_id === sale.id)
          .map(item => ({
            ...item,
            battery: batteries.find(b => b.id === item.battery_id)
          }));

        return {
          ...sale,
          customer: customers.find(c => c.id === sale.customer_id),
          vehicle: vehicles.find(v => v.id === sale.vehicle_id),
          items
        };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getSaleById(saleId: string): Promise<Sale | null> {
    const sales = await this.getSalesWithDetails();
    return sales.find(s => s.id === saleId) || null;
  },

  async createNewSale(input: CreateSaleInput): Promise<{ sale: Sale; warranty: Warranty; invoice: Invoice }> {
    const custId = input.customerId || input.customer_id || '';
    const vehId = input.vehicleId || input.vehicle_id;
    const batId = input.batteryId || input.battery_id || '';

    const batteries = localDb.getBatteries();
    const battery = batteries.find(b => b.id === batId);
    if (!battery) {
      throw new Error('Selected battery product not found');
    }

    const price = input.unitPrice || battery.selling_price;
    const disc = input.trade_in_discount || input.discountAmount || input.discount_amount || 0;
    const pMethod = input.paymentMethod || input.payment_method || 'UPI';

    // 1. Decrement inventory stock & log inventory transaction
    await inventoryService.updateStock(
      batId,
      'OUT',
      input.quantity,
      'SALE',
      `sale_temp_${Date.now()}`,
      `Sale of ${input.quantity}x ${battery.brand} ${battery.model}`
    );

    // 2. Calculate Pricing
    const subtotal = price * input.quantity;
    const discount = disc;
    const tax = input.taxAmount || input.tax_amount || 0;
    const total = subtotal - discount + tax;

    // Generate Invoice Number
    const salesCount = localDb.getSales().length + 1;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(salesCount).padStart(3, '0')}`;

    // 3. Create Sale Record
    const saleId = `s_${Date.now()}`;
    const newSale: Sale = {
      id: saleId,
      invoice_number: invoiceNumber,
      customer_id: custId,
      vehicle_id: vehId,
      sale_date: new Date().toISOString(),
      subtotal_amount: subtotal,
      discount_amount: discount,
      tax_amount: tax,
      total_amount: total,
      payment_method: pMethod,
      payment_status: 'PAID',
      notes: input.notes,
      created_at: new Date().toISOString()
    };

    const sales = localDb.getSales();
    sales.push(newSale);
    localDb.saveSales(sales);

    // 4. Create Sale Item Record
    const warrantyMonths = input.warrantyMonths || battery.warranty_months;
    const newSaleItem: SaleItem = {
      id: `si_${Date.now()}`,
      sale_id: saleId,
      battery_id: batId,
      quantity: input.quantity,
      unit_price: price,
      total_price: total,
      warranty_months: warrantyMonths
    };

    const saleItems = localDb.getSaleItems();
    saleItems.push(newSaleItem);
    localDb.saveSaleItems(saleItems);

    // 5. Calculate & Create Warranty Record
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + warrantyMonths);

    const warrantyCode = `WRN-${battery.brand.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newWarranty: Warranty = {
      id: `w_${Date.now()}`,
      sale_id: saleId,
      sale_item_id: newSaleItem.id,
      customer_id: custId,
      vehicle_id: vehId,
      battery_id: batId,
      warranty_code: warrantyCode,
      start_date: startDate.toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      status: 'ACTIVE',
      notes: `${warrantyMonths} Months Manufacturer Standard Warranty`,
      created_at: new Date().toISOString()
    };

    const warranties = localDb.getWarranties();
    warranties.push(newWarranty);
    localDb.saveWarranties(warranties);

    // 6. Create Digital Invoice Record
    const newInvoice: Invoice = {
      id: `i_${Date.now()}`,
      invoice_number: invoiceNumber,
      sale_id: saleId,
      customer_id: custId,
      business_name: 'PowerDrive Battery Solutions',
      gstin: '09AAACP1234H1Z5',
      total_amount: total,
      created_at: new Date().toISOString()
    };

    const invoices = localDb.getInvoices();
    invoices.push(newInvoice);
    localDb.saveInvoices(invoices);

    const completeSale = await this.getSaleById(saleId);

    return {
      sale: completeSale || newSale,
      warranty: newWarranty,
      invoice: newInvoice
    };
  }
};
