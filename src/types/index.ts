export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface Profile {
  id: string;
  auth_user_id?: string;
  role: UserRole;
  name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  profile_id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'EV' | 'Hybrid';

export interface Vehicle {
  id: string;
  customer_id: string;
  registration_number: string;
  make: string;
  model: string;
  variant?: string;
  fuel_type: FuelType;
  manufacturing_year?: number;
  created_at: string;
}

export type BatteryCategory = 'Four Wheeler' | 'Two Wheeler' | 'Commercial Heavy' | 'Inverter Tall Tubular';

export interface BatteryProduct {
  id: string;
  brand: string;
  model: string;
  category: BatteryCategory;
  ah: number;
  cca?: number;
  purchase_price: number;
  selling_price: number;
  warranty_months: number;
  sku: string;
  barcode?: string;
  is_active: boolean;
  created_at: string;
}

export interface Inventory {
  id: string;
  battery_id: string;
  stock_quantity: number;
  low_stock_threshold: number;
  location?: string;
  updated_at: string;
  battery?: BatteryProduct;
}

export type TransactionType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface InventoryTransaction {
  id: string;
  battery_id: string;
  transaction_type: TransactionType;
  quantity: number;
  reference_type?: string;
  reference_id?: string;
  notes?: string;
  created_at: string;
  battery?: BatteryProduct;
}

export type PaymentMethod = 'UPI / GPay' | 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer';
export type PaymentStatus = 'PAID' | 'PENDING' | 'PARTIAL';

export interface Sale {
  id: string;
  invoice_number: string;
  customer_id: string;
  vehicle_id?: string;
  sale_date: string;
  subtotal_amount: number;
  subtotal?: number;
  trade_in_discount?: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes?: string;
  created_at: string;
  customer?: Customer;
  vehicle?: Vehicle;
  items?: SaleItem[];
}

export interface SaleItem {
  id: string;
  sale_id: string;
  battery_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  warranty_months: number;
  battery?: BatteryProduct;
}

export type WarrantyStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';

export interface Warranty {
  id: string;
  sale_id: string;
  sale_item_id?: string;
  customer_id: string;
  vehicle_id?: string;
  battery_id: string;
  warranty_code: string;
  start_date: string;
  expiry_date: string;
  status: WarrantyStatus;
  notes?: string;
  created_at: string;
  customer?: Customer;
  vehicle?: Vehicle;
  battery?: BatteryProduct;
  sale?: Sale;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  sale_id: string;
  customer_id: string;
  business_name: string;
  gstin: string;
  total_amount: number;
  created_at: string;
  issue_date?: string;
  status?: string;
  sale?: Sale;
  customer?: Customer;
}

export type DiscountType = 'PERCENTAGE' | 'FLAT' | 'FIXED';

export interface Offer {
  id: string;
  title: string;
  description?: string;
  code?: string;
  discount_type: DiscountType;
  discount_value: number;
  applicable_brand?: string;
  start_date?: string;
  end_date?: string;
  valid_until?: string;
  is_active: boolean;
  created_at?: string;
}

export interface BatteryFitment {
  id: string;
  vehicle_make: string;
  vehicle_model: string;
  variant?: string;
  fuel_type?: FuelType;
  recommended_ah: number;
  battery_product_id: string;
  battery?: BatteryProduct;
}

export interface AuthState {
  user: Profile | null;
  customer: Customer | null;
  loading: boolean;
}
