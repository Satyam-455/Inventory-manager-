-- ============================================================================
-- BATTERY SHOP MANAGEMENT PLATFORM - SUPABASE SCHEMA & RLS POLICIES
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked to Auth Users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'CUSTOMER')) DEFAULT 'CUSTOMER',
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. CUSTOMERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. VEHICLES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    make VARCHAR(100) NOT NULL, -- e.g., Maruti Suzuki, Hyundai, Tata
    model VARCHAR(100) NOT NULL, -- e.g., Swift, Creta, Nexon
    variant VARCHAR(100),       -- e.g., VXi, SX, XZ+
    fuel_type VARCHAR(30) CHECK (fuel_type IN ('Petrol', 'Diesel', 'CNG', 'EV', 'Hybrid')),
    manufacturing_year INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. BATTERY PRODUCTS CATALOG
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.battery_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand VARCHAR(100) NOT NULL, -- e.g., Exide, Amaron, SF Sonic
    model VARCHAR(100) NOT NULL, -- e.g., Matrix Red, Hi-Life Flo
    category VARCHAR(50) DEFAULT 'Four Wheeler', -- Four Wheeler, Two Wheeler, Inverter, Commercial
    ah INTEGER NOT NULL,          -- Ah capacity, e.g., 35, 45, 65, 150
    cca INTEGER,                 -- Cold Cranking Amps if applicable
    purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    warranty_months INTEGER NOT NULL DEFAULT 36,
    sku VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. INVENTORY & INVENTORY TRANSACTIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battery_id UUID UNIQUE NOT NULL REFERENCES public.battery_products(id) ON DELETE CASCADE,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 3,
    location VARCHAR(100) DEFAULT 'Main Store Shelf',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battery_id UUID NOT NULL REFERENCES public.battery_products(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('IN', 'OUT', 'ADJUSTMENT')),
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50), -- 'SALE', 'PURCHASE', 'MANUAL'
    reference_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. SALES & SALE ITEMS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    sale_date TIMESTAMPTZ DEFAULT NOW(),
    subtotal_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('UPI / GPay', 'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer')) DEFAULT 'UPI / GPay',
    payment_status VARCHAR(20) CHECK (payment_status IN ('PAID', 'PENDING', 'PARTIAL')) DEFAULT 'PAID',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    battery_id UUID NOT NULL REFERENCES public.battery_products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    warranty_months INTEGER NOT NULL
);

-- ----------------------------------------------------------------------------
-- 7. WARRANTIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.warranties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    sale_item_id UUID REFERENCES public.sale_items(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    battery_id UUID NOT NULL REFERENCES public.battery_products(id) ON DELETE RESTRICT,
    warranty_code VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'EXPIRING_SOON', 'EXPIRED')) DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. INVOICES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    sale_id UUID UNIQUE NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    business_name VARCHAR(255) DEFAULT 'PowerDrive Battery Solutions',
    gstin VARCHAR(30) DEFAULT '09AAACP1234H1Z5',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. OFFERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) CHECK (discount_type IN ('PERCENTAGE', 'FLAT')) DEFAULT 'FLAT',
    discount_value DECIMAL(10,2) NOT NULL,
    applicable_brand VARCHAR(100), -- All Brands, Exide, Amaron, etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. BATTERY FITMENTS TABLE (Recommendations Engine)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.battery_fitments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_make VARCHAR(100) NOT NULL,
    vehicle_model VARCHAR(100) NOT NULL,
    variant VARCHAR(100),
    fuel_type VARCHAR(30),
    recommended_ah INTEGER NOT NULL,
    battery_product_id UUID REFERENCES public.battery_products(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR HIGH PERFORMANCE SEARCHES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_vehicles_reg ON public.vehicles(registration_number);
CREATE INDEX IF NOT EXISTS idx_sales_invoice ON public.sales(invoice_number);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON public.sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_warranties_expiry ON public.warranties(expiry_date);
CREATE INDEX IF NOT EXISTS idx_warranties_customer ON public.warranties(customer_id);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battery_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battery_fitments ENABLE ROW LEVEL SECURITY;

-- Helper Function: Is User Admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_user_id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth_user_id = auth.uid() OR is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth_user_id = auth.uid() OR is_admin());

-- CUSTOMERS POLICIES
CREATE POLICY "Admins full access to customers" ON public.customers FOR ALL USING (is_admin());
CREATE POLICY "Customers view own record" ON public.customers FOR SELECT USING (
  profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);

-- VEHICLES POLICIES
CREATE POLICY "Admins full access to vehicles" ON public.vehicles FOR ALL USING (is_admin());
CREATE POLICY "Customers view own vehicles" ON public.vehicles FOR SELECT USING (
  customer_id IN (
    SELECT c.id FROM public.customers c
    JOIN public.profiles p ON c.profile_id = p.id
    WHERE p.auth_user_id = auth.uid()
  )
);

-- BATTERY PRODUCTS & INVENTORY POLICIES (Public/Customer Read, Admin Manage)
CREATE POLICY "Anyone can view active battery products" ON public.battery_products FOR SELECT USING (TRUE);
CREATE POLICY "Admins full access to battery products" ON public.battery_products FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view inventory" ON public.inventory FOR SELECT USING (TRUE);
CREATE POLICY "Admins full access to inventory" ON public.inventory FOR ALL USING (is_admin());
CREATE POLICY "Admins view transactions" ON public.inventory_transactions FOR ALL USING (is_admin());

-- SALES, INVOICES & WARRANTIES POLICIES
CREATE POLICY "Admins full access to sales" ON public.sales FOR ALL USING (is_admin());
CREATE POLICY "Customers view own sales" ON public.sales FOR SELECT USING (
  customer_id IN (
    SELECT c.id FROM public.customers c
    JOIN public.profiles p ON c.profile_id = p.id
    WHERE p.auth_user_id = auth.uid()
  )
);

CREATE POLICY "Admins full access to sale_items" ON public.sale_items FOR ALL USING (is_admin());
CREATE POLICY "Customers view own sale items" ON public.sale_items FOR SELECT USING (
  sale_id IN (
    SELECT s.id FROM public.sales s
    JOIN public.customers c ON s.customer_id = c.id
    JOIN public.profiles p ON c.profile_id = p.id
    WHERE p.auth_user_id = auth.uid()
  )
);

CREATE POLICY "Admins full access to warranties" ON public.warranties FOR ALL USING (is_admin());
CREATE POLICY "Customers view own warranties" ON public.warranties FOR SELECT USING (
  customer_id IN (
    SELECT c.id FROM public.customers c
    JOIN public.profiles p ON c.profile_id = p.id
    WHERE p.auth_user_id = auth.uid()
  )
);

CREATE POLICY "Admins full access to invoices" ON public.invoices FOR ALL USING (is_admin());
CREATE POLICY "Customers view own invoices" ON public.invoices FOR SELECT USING (
  customer_id IN (
    SELECT c.id FROM public.customers c
    JOIN public.profiles p ON c.profile_id = p.id
    WHERE p.auth_user_id = auth.uid()
  )
);

-- OFFERS POLICIES
CREATE POLICY "Anyone can view active offers" ON public.offers FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admins full access to offers" ON public.offers FOR ALL USING (is_admin());

-- FITMENTS POLICIES
CREATE POLICY "Anyone can view battery fitments" ON public.battery_fitments FOR SELECT USING (TRUE);
CREATE POLICY "Admins full access to fitments" ON public.battery_fitments FOR ALL USING (is_admin());
