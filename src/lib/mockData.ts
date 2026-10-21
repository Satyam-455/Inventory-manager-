import { Customer, Vehicle, BatteryProduct, Inventory, InventoryTransaction, Sale, SaleItem, Warranty, Invoice, Offer, BatteryFitment, Profile } from '../types';

export const initialProfiles: Profile[] = [
  {
    id: 'p0',
    auth_user_id: 'admin-auth-id',
    role: 'ADMIN',
    name: 'Rajesh Agarwal (Owner)',
    phone: '+91 98390 12345',
    created_at: new Date(Date.now() - 90 * 86400000).toISOString()
  },
  {
    id: 'p1',
    auth_user_id: 'rahul-auth-id',
    role: 'CUSTOMER',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'p2',
    auth_user_id: 'priya-auth-id',
    role: 'CUSTOMER',
    name: 'Priya Verma',
    phone: '+91 98123 45678',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'c1',
    profile_id: 'p1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@gmail.com',
    address: '14/2 Civil Lines, Prayagraj, UP',
    notes: 'Regular customer, Swift owner',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'c2',
    profile_id: 'p2',
    name: 'Priya Verma',
    phone: '+91 98123 45678',
    email: 'priya.verma@yahoo.com',
    address: '42 Tagore Town, Prayagraj, UP',
    notes: 'Requested Exide warranty card copy',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'c3',
    name: 'Amitabh Gupta',
    phone: '+91 94150 99887',
    email: 'amita.gupta@hotmail.com',
    address: 'Kataka Crossing, Prayagraj, UP',
    notes: 'Taxi operator (3 commercial vehicles)',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'c4',
    name: 'Suresh Kumar Yadav',
    phone: '+91 97980 11223',
    email: 'skyadav@gmail.com',
    address: 'Naini Industrial Area, Phase 2, UP',
    notes: 'Prefers Amaron heavy duty',
    created_at: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    id: 'c5',
    name: 'Ananya Mishra',
    phone: '+91 93350 77665',
    email: 'ananya.mishra@outlook.com',
    address: 'Ashok Nagar, Main Road, UP',
    notes: 'Activa battery purchase',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'c6',
    name: 'Vikram Singh',
    phone: '+91 95590 33445',
    email: 'vikram.singh@rediffmail.com',
    address: 'Preetam Nagar, Block B, UP',
    notes: 'Enquired about inverter battery',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

export const initialVehicles: Vehicle[] = [
  {
    id: 'v1',
    customer_id: 'c1',
    registration_number: 'UP70AB1234',
    make: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'VXi',
    fuel_type: 'Petrol',
    manufacturing_year: 2021,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'v2',
    customer_id: 'c2',
    registration_number: 'UP70CX9988',
    make: 'Hyundai',
    model: 'Creta',
    variant: 'SX Tech',
    fuel_type: 'Diesel',
    manufacturing_year: 2022,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'v3',
    customer_id: 'c3',
    registration_number: 'UP70ET4567',
    make: 'Mahindra',
    model: 'Bolero',
    variant: 'ZLX',
    fuel_type: 'Diesel',
    manufacturing_year: 2019,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'v4',
    customer_id: 'c4',
    registration_number: 'UP70BZ5544',
    make: 'Tata',
    model: 'Nexon',
    variant: 'XZ+',
    fuel_type: 'Petrol',
    manufacturing_year: 2020,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    id: 'v5',
    customer_id: 'c5',
    registration_number: 'UP70DF3322',
    make: 'Honda',
    model: 'Activa 6G',
    variant: 'DLX',
    fuel_type: 'Petrol',
    manufacturing_year: 2023,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

export const initialBatteries: BatteryProduct[] = [
  {
    id: 'b1',
    brand: 'Exide',
    model: 'Matrix Red MTRED35L',
    category: 'Four Wheeler',
    ah: 35,
    cca: 300,
    purchase_price: 3400,
    selling_price: 4600,
    warranty_months: 72,
    sku: 'EXD-MTR-35L',
    barcode: '8901234567891',
    is_active: true,
    created_at: new Date(Date.now() - 100 * 86400000).toISOString()
  },
  {
    id: 'b2',
    brand: 'Amaron',
    model: 'Hi-Life Flo BH45D21L',
    category: 'Four Wheeler',
    ah: 45,
    cca: 380,
    purchase_price: 4100,
    selling_price: 5450,
    warranty_months: 60,
    sku: 'AMR-FLO-45L',
    barcode: '8901234567892',
    is_active: true,
    created_at: new Date(Date.now() - 100 * 86400000).toISOString()
  },
  {
    id: 'b3',
    brand: 'Exide',
    model: 'EPIQ EPIQ65D26R',
    category: 'Four Wheeler',
    ah: 65,
    cca: 520,
    purchase_price: 5600,
    selling_price: 7200,
    warranty_months: 72,
    sku: 'EXD-EPQ-65R',
    barcode: '8901234567893',
    is_active: true,
    created_at: new Date(Date.now() - 100 * 86400000).toISOString()
  },
  {
    id: 'b4',
    brand: 'SF Sonic',
    model: 'Flash Start FS1080-35L',
    category: 'Four Wheeler',
    ah: 35,
    cca: 280,
    purchase_price: 3100,
    selling_price: 4200,
    warranty_months: 48,
    sku: 'SFS-FSH-35L',
    barcode: '8901234567894',
    is_active: true,
    created_at: new Date(Date.now() - 100 * 86400000).toISOString()
  },
  {
    id: 'b5',
    brand: 'Amaron',
    model: 'Pro Din 74 Ah',
    category: 'Four Wheeler',
    ah: 74,
    cca: 640,
    purchase_price: 6800,
    selling_price: 8900,
    warranty_months: 60,
    sku: 'AMR-PRO-DIN74',
    barcode: '8901234567895',
    is_active: true,
    created_at: new Date(Date.now() - 100 * 86400000).toISOString()
  },
  {
    id: 'b6',
    brand: 'Exide',
    model: 'FXL0-XPLORE XLTZ5',
    category: 'Two Wheeler',
    ah: 5,
    cca: 60,
    purchase_price: 950,
    selling_price: 1450,
    warranty_months: 48,
    sku: 'EXD-XPL-TZ5',
    barcode: '8901234567897',
    is_active: true,
    created_at: new Date(Date.now() - 100 * 86400000).toISOString()
  },
  {
    id: 'b7',
    brand: 'Exide',
    model: 'Inva Master IMST1500',
    category: 'Inverter Tall Tubular',
    ah: 150,
    purchase_price: 11500,
    selling_price: 15800,
    warranty_months: 60,
    sku: 'EXD-INV-1500',
    barcode: '8901234567899',
    is_active: true,
    created_at: new Date(Date.now() - 100 * 86400000).toISOString()
  }
];

export const initialInventory: Inventory[] = [
  {
    id: 'inv1',
    battery_id: 'b1',
    stock_quantity: 14,
    low_stock_threshold: 4,
    location: 'Front Display Rack A1',
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv2',
    battery_id: 'b2',
    stock_quantity: 2, // LOW STOCK ALERT
    low_stock_threshold: 5,
    location: 'Rack B2 - Low Stock Warning',
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv3',
    battery_id: 'b3',
    stock_quantity: 8,
    low_stock_threshold: 3,
    location: 'Rack B1',
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv4',
    battery_id: 'b4',
    stock_quantity: 11,
    low_stock_threshold: 4,
    location: 'Rack A2',
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv5',
    battery_id: 'b5',
    stock_quantity: 1, // LOW STOCK ALERT
    low_stock_threshold: 3,
    location: 'Heavy Duty Section C1',
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv6',
    battery_id: 'b6',
    stock_quantity: 22,
    low_stock_threshold: 6,
    location: 'Two Wheeler Drawer T1',
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv7',
    battery_id: 'b7',
    stock_quantity: 4,
    low_stock_threshold: 2,
    location: 'Inverter Bay I1',
    updated_at: new Date().toISOString()
  }
];

export const initialTransactions: InventoryTransaction[] = [
  {
    id: 'tx1',
    battery_id: 'b1',
    transaction_type: 'IN',
    quantity: 15,
    reference_type: 'PURCHASE',
    notes: 'Initial stock load from Exide distributor',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'tx2',
    battery_id: 'b1',
    transaction_type: 'OUT',
    quantity: 1,
    reference_type: 'SALE',
    reference_id: 's1',
    notes: 'Sale to Rahul Sharma (UP70AB1234)',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'tx3',
    battery_id: 'b2',
    transaction_type: 'OUT',
    quantity: 1,
    reference_type: 'SALE',
    reference_id: 's2',
    notes: 'Sale to Priya Verma (UP70CX9988)',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString()
  }
];

export const initialSales: Sale[] = [
  {
    id: 's1',
    invoice_number: 'INV-2024-001',
    customer_id: 'c1',
    vehicle_id: 'v1',
    sale_date: new Date(Date.now() - 25 * 86400000).toISOString(),
    subtotal_amount: 4600,
    discount_amount: 200,
    tax_amount: 0,
    total_amount: 4400,
    payment_method: 'UPI / GPay',
    payment_status: 'PAID',
    notes: 'New battery installation for Maruti Swift VXi',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 's2',
    invoice_number: 'INV-2024-002',
    customer_id: 'c2',
    vehicle_id: 'v2',
    sale_date: new Date(Date.now() - 12 * 86400000).toISOString(),
    subtotal_amount: 5450,
    discount_amount: 250,
    tax_amount: 0,
    total_amount: 5200,
    payment_method: 'UPI / GPay',
    payment_status: 'PAID',
    notes: 'Amaron Flo installed in Hyundai Creta',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: 's3',
    invoice_number: 'INV-2024-003',
    customer_id: 'c3',
    vehicle_id: 'v3',
    sale_date: new Date(Date.now() - 65 * 86400000).toISOString(),
    subtotal_amount: 7200,
    discount_amount: 400,
    tax_amount: 0,
    total_amount: 6800,
    payment_method: 'Cash',
    payment_status: 'PAID',
    notes: 'Bolero Commercial Heavy Duty replacement',
    created_at: new Date(Date.now() - 65 * 86400000).toISOString()
  }
];

export const initialSaleItems: SaleItem[] = [
  {
    id: 'si1',
    sale_id: 's1',
    battery_id: 'b1',
    quantity: 1,
    unit_price: 4600,
    total_price: 4400,
    warranty_months: 72
  },
  {
    id: 'si2',
    sale_id: 's2',
    battery_id: 'b2',
    quantity: 1,
    unit_price: 5450,
    total_price: 5200,
    warranty_months: 60
  },
  {
    id: 'si3',
    sale_id: 's3',
    battery_id: 'b3',
    quantity: 1,
    unit_price: 7200,
    total_price: 6800,
    warranty_months: 72
  }
];

export const initialWarranties: Warranty[] = [
  {
    id: 'w1',
    sale_id: 's1',
    sale_item_id: 'si1',
    customer_id: 'c1',
    vehicle_id: 'v1',
    battery_id: 'b1',
    warranty_code: 'WRN-EXD-78901',
    start_date: new Date(Date.now() - 25 * 86400000).toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + (72 * 30 - 25) * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    notes: '6 Years Exide Full Coverage Warranty',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'w2',
    sale_id: 's2',
    sale_item_id: 'si2',
    customer_id: 'c2',
    vehicle_id: 'v2',
    battery_id: 'b2',
    warranty_code: 'WRN-AMR-55443',
    start_date: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + (60 * 30 - 12) * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    notes: '5 Years Amaron Pro-Rata Warranty',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: 'w3',
    sale_id: 's3',
    sale_item_id: 'si3',
    customer_id: 'c3',
    vehicle_id: 'v3',
    battery_id: 'b3',
    warranty_code: 'WRN-EXD-11223',
    start_date: new Date(Date.now() - 360 * 86400000).toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0], // EXPIRING SOON
    status: 'EXPIRING_SOON',
    notes: 'Expiring within 30 days - Send renewal reminder',
    created_at: new Date(Date.now() - 360 * 86400000).toISOString()
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'i1',
    invoice_number: 'INV-2024-001',
    sale_id: 's1',
    customer_id: 'c1',
    business_name: 'PowerDrive Battery Solutions',
    gstin: '09AAACP1234H1Z5',
    total_amount: 4400,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'i2',
    invoice_number: 'INV-2024-002',
    sale_id: 's2',
    customer_id: 'c2',
    business_name: 'PowerDrive Battery Solutions',
    gstin: '09AAACP1234H1Z5',
    total_amount: 5200,
    created_at: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: 'i3',
    invoice_number: 'INV-2024-003',
    sale_id: 's3',
    customer_id: 'c3',
    business_name: 'PowerDrive Battery Solutions',
    gstin: '09AAACP1234H1Z5',
    total_amount: 6800,
    created_at: new Date(Date.now() - 65 * 86400000).toISOString()
  }
];

export const initialOffers: Offer[] = [
  {
    id: 'o1',
    title: 'Festive Exchange Bonus ₹500',
    description: 'Flat ₹500 discount on exchanging old car battery with any Exide Matrix battery.',
    discount_type: 'FLAT',
    discount_value: 500,
    applicable_brand: 'Exide',
    start_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    is_active: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'o2',
    title: 'Monsoon Free Checkup & 10% Off',
    description: 'Free terminal health checkup + 10% off on all Amaron Hi-Life Flo series batteries.',
    discount_type: 'PERCENTAGE',
    discount_value: 10,
    applicable_brand: 'Amaron',
    start_date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    is_active: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'o3',
    title: 'Two-Wheeler Combo Discount ₹200',
    description: 'Save ₹200 on buying any bike battery with instant free installation.',
    discount_type: 'FLAT',
    discount_value: 200,
    applicable_brand: 'All Brands',
    start_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
    is_active: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

export const initialFitments: BatteryFitment[] = [
  {
    id: 'f1',
    vehicle_make: 'Maruti Suzuki',
    vehicle_model: 'Swift',
    variant: 'VXi',
    fuel_type: 'Petrol',
    recommended_ah: 35,
    battery_product_id: 'b1'
  },
  {
    id: 'f2',
    vehicle_make: 'Hyundai',
    vehicle_model: 'Creta',
    variant: 'SX Tech',
    fuel_type: 'Diesel',
    recommended_ah: 45,
    battery_product_id: 'b2'
  },
  {
    id: 'f3',
    vehicle_make: 'Mahindra',
    vehicle_model: 'Bolero',
    variant: 'ZLX',
    fuel_type: 'Diesel',
    recommended_ah: 65,
    battery_product_id: 'b3'
  },
  {
    id: 'f4',
    vehicle_make: 'Tata',
    vehicle_model: 'Nexon',
    variant: 'XZ+',
    fuel_type: 'Petrol',
    recommended_ah: 35,
    battery_product_id: 'b4'
  },
  {
    id: 'f5',
    vehicle_make: 'Honda',
    vehicle_model: 'Activa 6G',
    variant: 'DLX',
    fuel_type: 'Petrol',
    recommended_ah: 5,
    battery_product_id: 'b6'
  }
];
