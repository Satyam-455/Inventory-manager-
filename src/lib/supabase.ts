import { createClient } from '@supabase/supabase-js';
import { 
  initialProfiles, 
  initialCustomers, 
  initialVehicles, 
  initialBatteries, 
  initialInventory, 
  initialTransactions, 
  initialSales, 
  initialSaleItems, 
  initialWarranties, 
  initialInvoices, 
  initialOffers, 
  initialFitments 
} from './mockData';
import { 
  Profile, 
  Customer, 
  Vehicle, 
  BatteryProduct, 
  Inventory, 
  InventoryTransaction, 
  Sale, 
  SaleItem, 
  Warranty, 
  Invoice, 
  Offer, 
  BatteryFitment 
} from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// CLIENT PERSISTENCE ENGINE (Direct Supabase SDK Parity + Fallback Sync)
// ============================================================================

const STORAGE_KEYS = {
  PROFILES: 'battery_profiles',
  CUSTOMERS: 'battery_customers',
  VEHICLES: 'battery_vehicles',
  BATTERIES: 'battery_products',
  INVENTORY: 'battery_inventory',
  TRANSACTIONS: 'battery_transactions',
  SALES: 'battery_sales',
  SALE_ITEMS: 'battery_sale_items',
  WARRANTIES: 'battery_warranties',
  INVOICES: 'battery_invoices',
  OFFERS: 'battery_offers',
  FITMENTS: 'battery_fitments',
  CURRENT_USER: 'battery_current_user_profile'
};

function getStorage<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch (err) {
    return defaultData;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// Initial storage setup
export const localDb = {
  getProfiles: (): Profile[] => getStorage(STORAGE_KEYS.PROFILES, initialProfiles),
  saveProfiles: (data: Profile[]) => setStorage(STORAGE_KEYS.PROFILES, data),

  getCustomers: (): Customer[] => getStorage(STORAGE_KEYS.CUSTOMERS, initialCustomers),
  saveCustomers: (data: Customer[]) => setStorage(STORAGE_KEYS.CUSTOMERS, data),

  getVehicles: (): Vehicle[] => getStorage(STORAGE_KEYS.VEHICLES, initialVehicles),
  saveVehicles: (data: Vehicle[]) => setStorage(STORAGE_KEYS.VEHICLES, data),

  getBatteries: (): BatteryProduct[] => getStorage(STORAGE_KEYS.BATTERIES, initialBatteries),
  saveBatteries: (data: BatteryProduct[]) => setStorage(STORAGE_KEYS.BATTERIES, data),

  getInventory: (): Inventory[] => getStorage(STORAGE_KEYS.INVENTORY, initialInventory),
  saveInventory: (data: Inventory[]) => setStorage(STORAGE_KEYS.INVENTORY, data),

  getTransactions: (): InventoryTransaction[] => getStorage(STORAGE_KEYS.TRANSACTIONS, initialTransactions),
  saveTransactions: (data: InventoryTransaction[]) => setStorage(STORAGE_KEYS.TRANSACTIONS, data),

  getSales: (): Sale[] => getStorage(STORAGE_KEYS.SALES, initialSales),
  saveSales: (data: Sale[]) => setStorage(STORAGE_KEYS.SALES, data),

  getSaleItems: (): SaleItem[] => getStorage(STORAGE_KEYS.SALE_ITEMS, initialSaleItems),
  saveSaleItems: (data: SaleItem[]) => setStorage(STORAGE_KEYS.SALE_ITEMS, data),

  getWarranties: (): Warranty[] => getStorage(STORAGE_KEYS.WARRANTIES, initialWarranties),
  saveWarranties: (data: Warranty[]) => setStorage(STORAGE_KEYS.WARRANTIES, data),

  getInvoices: (): Invoice[] => getStorage(STORAGE_KEYS.INVOICES, initialInvoices),
  saveInvoices: (data: Invoice[]) => setStorage(STORAGE_KEYS.INVOICES, data),

  getOffers: (): Offer[] => getStorage(STORAGE_KEYS.OFFERS, initialOffers),
  saveOffers: (data: Offer[]) => setStorage(STORAGE_KEYS.OFFERS, data),

  getFitments: (): BatteryFitment[] => getStorage(STORAGE_KEYS.FITMENTS, initialFitments),
  saveFitments: (data: BatteryFitment[]) => setStorage(STORAGE_KEYS.FITMENTS, data),

  getCurrentUser: (): Profile => getStorage(STORAGE_KEYS.CURRENT_USER, initialProfiles[0]),
  setCurrentUser: (profile: Profile) => setStorage(STORAGE_KEYS.CURRENT_USER, profile),
};
