-- ============================================================================
-- BATTERY SHOP MANAGEMENT PLATFORM - SEED DATA SCRIPT (INDIAN RETAIL CONTEXT)
-- ============================================================================

-- Insert Default Admin Profile
INSERT INTO public.profiles (id, role, name, phone)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Rajesh Agarwal (Owner)', '+91 98390 12345')
ON CONFLICT (id) DO NOTHING;

-- Insert Customers
INSERT INTO public.customers (id, name, phone, email, address, notes)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'Rahul Sharma', '+91 98765 43210', 'rahul.sharma@gmail.com', 'Civil Lines, Prayagraj, UP', 'Regular customer, Swift owner'),
    ('c1000000-0000-0000-0000-000000000002', 'Priya Verma', '+91 98123 45678', 'priya.verma@yahoo.com', 'Tagore Town, Prayagraj, UP', 'Requested Exide warranty card'),
    ('c1000000-0000-0000-0000-000000000003', 'Amitabh Gupta', '+91 94150 99887', 'amita.gupta@hotmail.com', 'Katakra, Prayagraj, UP', 'Taxi operator (3 vehicles)'),
    ('c1000000-0000-0000-0000-000000000004', 'Suresh Kumar Yadav', '+91 97980 11223', 'skyadav@gmail.com', 'Naini Industrial Area, UP', 'Prefers Amaron heavy duty'),
    ('c1000000-0000-0000-0000-000000000005', 'Ananya Mishra', '+91 93350 77665', 'ananya.mishra@outlook.com', 'Ashok Nagar, Prayagraj, UP', 'Scooter battery replaced last year'),
    ('c1000000-0000-0000-0000-000000000006', 'Vikram Singh', '+91 95590 33445', 'vikram.singh@rediffmail.com', 'Preetam Nagar, UP', 'Inverter battery enquiry'),
    ('c1000000-0000-0000-0000-000000000007', 'Deepak Tiwari', '+91 98899 22110', 'deepak.tiwari@gmail.com', 'Allahpur, Prayagraj, UP', 'Commercial Bolero owner'),
    ('c1000000-0000-0000-0000-000000000008', 'Meena Rastogi', '+91 91250 88776', 'meena.r@gmail.com', 'Lukerganj, Prayagraj, UP', 'Prompt UPI payments')
ON CONFLICT (phone) DO NOTHING;

-- Insert Customer Profiles linked to Customer accounts
INSERT INTO public.profiles (id, role, name, phone)
VALUES
    ('p1000000-0000-0000-0000-000000000001', 'CUSTOMER', 'Rahul Sharma', '+91 98765 43210'),
    ('p1000000-0000-0000-0000-000000000002', 'CUSTOMER', 'Priya Verma', '+91 98123 45678')
ON CONFLICT (id) DO NOTHING;

UPDATE public.customers SET profile_id = 'p1000000-0000-0000-0000-000000000001' WHERE id = 'c1000000-0000-0000-0000-000000000001';
UPDATE public.customers SET profile_id = 'p1000000-0000-0000-0000-000000000002' WHERE id = 'c1000000-0000-0000-0000-000000000002';

-- Insert Vehicles
INSERT INTO public.vehicles (id, customer_id, registration_number, make, model, variant, fuel_type, manufacturing_year)
VALUES
    ('v1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'UP70AB1234', 'Maruti Suzuki', 'Swift', 'VXi', 'Petrol', 2021),
    ('v1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'UP70CX9988', 'Hyundai', 'Creta', 'SX Tech', 'Diesel', 2022),
    ('v1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'UP70ET4567', 'Mahindra', 'Bolero', 'ZLX', 'Diesel', 2019),
    ('v1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'UP70BZ5544', 'Tata', 'Nexon', 'XZ+', 'Petrol', 2020),
    ('v1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005', 'UP70DF3322', 'Honda', 'Activa 6G', 'DLX', 'Petrol', 2023),
    ('v1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000006', 'UP70AK7711', 'Toyota', 'Innova Crysta', '2.4 GX', 'Diesel', 2021),
    ('v1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000007', 'UP70BL8899', 'Mahindra', 'Scorpio-N', 'Z8', 'Diesel', 2023),
    ('v1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000008', 'UP70CJ1122', 'Maruti Suzuki', 'Balanos', 'Zeta', 'Petrol', 2022)
ON CONFLICT (registration_number) DO NOTHING;

-- Insert Battery Products Catalog
INSERT INTO public.battery_products (id, brand, model, category, ah, cca, purchase_price, selling_price, warranty_months, sku, barcode)
VALUES
    ('b1000000-0000-0000-0000-000000000001', 'Exide', 'Matrix Red MTRED35L', 'Four Wheeler', 35, 300, 3400.00, 4600.00, 72, 'EXD-MTR-35L', '8901234567891'),
    ('b1000000-0000-0000-0000-000000000002', 'Amaron', 'Hi-Life Flo BH45D21L', 'Four Wheeler', 45, 380, 4100.00, 5450.00, 60, 'AMR-FLO-45L', '8901234567892'),
    ('b1000000-0000-0000-0000-000000000003', 'Exide', 'EPIQ EPIQ65D26R', 'Four Wheeler', 65, 520, 5600.00, 7200.00, 72, 'EXD-EPQ-65R', '8901234567893'),
    ('b1000000-0000-0000-0000-000000000004', 'SF Sonic', 'Flash Start FS1080-35L', 'Four Wheeler', 35, 280, 3100.00, 4200.00, 48, 'SFS-FSH-35L', '8901234567894'),
    ('b1000000-0000-0000-0000-000000000005', 'Amaron', 'Pro Din 74 Ah', 'Four Wheeler', 74, 640, 6800.00, 8900.00, 60, 'AMR-PRO-DIN74', '8901234567895'),
    ('b1000000-0000-0000-0000-000000000006', 'Exide', 'Xpress Heavy Duty XP1000', 'Commercial Heavy', 100, 750, 7900.00, 10500.00, 36, 'EXD-XPR-1000', '8901234567896'),
    ('b1000000-0000-0000-0000-000000000007', 'Exide', 'FXL0-XPLORE XLTZ5', 'Two Wheeler', 5, 60, 950.00, 1450.00, 48, 'EXD-XPL-TZ5', '8901234567897'),
    ('b1000000-0000-0000-0000-000000000008', 'Amaron', 'Rider Beta ABTZ5L', 'Two Wheeler', 5, 65, 1020.00, 1520.00, 48, 'AMR-RDR-TZ5L', '8901234567898'),
    ('b1000000-0000-0000-0000-000000000009', 'Exide', 'Inva Master IMST1500', 'Inverter Tall Tubular', 150, NULL, 11500.00, 15800.00, 60, 'EXD-INV-1500', '8901234567899')
ON CONFLICT (sku) DO NOTHING;

-- Insert Inventory Levels
INSERT INTO public.inventory (battery_id, stock_quantity, low_stock_threshold, location)
VALUES
    ('b1000000-0000-0000-0000-000000000001', 14, 4, 'Front Display Rack A1'),
    ('b1000000-0000-0000-0000-000000000002', 2, 5, 'Rack B2 - Low Stock Warning'),
    ('b1000000-0000-0000-0000-000000000003', 8, 3, 'Rack B1'),
    ('b1000000-0000-0000-0000-000000000004', 11, 4, 'Rack A2'),
    ('b1000000-0000-0000-0000-000000000005', 1, 3, 'Heavy Duty Section C1'),
    ('b1000000-0000-0000-0000-000000000006', 5, 2, 'Warehouse Bay 3'),
    ('b1000000-0000-0000-0000-000000000007', 22, 6, 'Two Wheeler Drawer T1'),
    ('b1000000-0000-0000-0000-000000000008', 18, 5, 'Two Wheeler Drawer T2'),
    ('b1000000-0000-0000-0000-000000000009', 4, 2, 'Inverter Bay I1')
ON CONFLICT (battery_id) DO NOTHING;

-- Insert Past Sales & Transactions
INSERT INTO public.sales (id, invoice_number, customer_id, vehicle_id, sale_date, subtotal_amount, discount_amount, tax_amount, total_amount, payment_method, payment_status, notes)
VALUES
    ('s1000000-0000-0000-0000-000000000001', 'INV-2024-001', 'c1000000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '25 days', 4600.00, 200.00, 0.00, 4400.00, 'UPI / GPay', 'PAID', 'New battery installation for Maruti Swift'),
    ('s1000000-0000-0000-0000-000000000002', 'INV-2024-002', 'c1000000-0000-0000-0000-000000000002', 'v1000000-0000-0000-0000-000000000002', NOW() - INTERVAL '12 days', 5450.00, 250.00, 0.00, 5200.00, 'UPI / GPay', 'PAID', 'Amaron Flo installed in Hyundai Creta'),
    ('s1000000-0000-0000-0000-000000000003', 'INV-2024-003', 'c1000000-0000-0000-0000-000000000003', 'v1000000-0000-0000-0000-000000000003', NOW() - INTERVAL '65 days', 7200.00, 400.00, 0.00, 6800.00, 'Cash', 'PAID', 'Commercial Bolero battery replacement')
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO public.sale_items (sale_id, battery_id, quantity, unit_price, total_price, warranty_months)
VALUES
    ('s1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 1, 4600.00, 4400.00, 72),
    ('s1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 1, 5450.00, 5200.00, 60),
    ('s1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 1, 7200.00, 6800.00, 72);

-- Insert Warranties
INSERT INTO public.warranties (id, sale_id, customer_id, vehicle_id, battery_id, warranty_code, start_date, expiry_date, status, notes)
VALUES
    ('w1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'WRN-EXD-78901', CURRENT_DATE - 25, CURRENT_DATE + 2165, 'ACTIVE', '6 Years Exide Full Coverage Warranty'),
    ('w1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'v1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'WRN-AMR-55443', CURRENT_DATE - 12, CURRENT_DATE + 1813, 'ACTIVE', '5 Years Amaron Pro-Rata Warranty'),
    ('w1000000-0000-0000-0000-000000000003', 's1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'v1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'WRN-EXD-11223', CURRENT_DATE - 360, CURRENT_DATE + 15, 'EXPIRING_SOON', 'Expiring within 30 days')
ON CONFLICT (warranty_code) DO NOTHING;

-- Insert Digital Invoices
INSERT INTO public.invoices (id, invoice_number, sale_id, customer_id, business_name, gstin, total_amount)
VALUES
    ('i1000000-0000-0000-0000-000000000001', 'INV-2024-001', 's1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'PowerDrive Battery Solutions', '09AAACP1234H1Z5', 4400.00),
    ('i1000000-0000-0000-0000-000000000002', 'INV-2024-002', 's1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'PowerDrive Battery Solutions', '09AAACP1234H1Z5', 5200.00),
    ('i1000000-0000-0000-0000-000000000003', 'INV-2024-003', 's1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'PowerDrive Battery Solutions', '09AAACP1234H1Z5', 6800.00)
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert Active Shop Promotional Offers
INSERT INTO public.offers (id, title, description, discount_type, discount_value, applicable_brand, start_date, end_date, is_active)
VALUES
    ('o1000000-0000-0000-0000-000000000001', 'Festive Exchange Bonus ₹500', 'Flat ₹500 discount on exchanging old car battery with any Exide Matrix battery.', 'FLAT', 500.00, 'Exide', CURRENT_DATE - 5, CURRENT_DATE + 30, TRUE),
    ('o1000000-0000-0000-0000-000000000002', 'Monsoon Free Checkup & 10% Off', 'Free health checkup + 10% off on all Amaron Hi-Life Flo series batteries.', 'PERCENTAGE', 10.00, 'Amaron', CURRENT_DATE - 10, CURRENT_DATE + 45, TRUE),
    ('o1000000-0000-0000-0000-000000000003', 'Two-Wheeler Combo Discount ₹200', 'Save ₹200 on buying any bike battery with instant installation.', 'FLAT', 200.00, 'All Brands', CURRENT_DATE - 2, CURRENT_DATE + 20, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert Battery Fitment Rules (Recommendation Engine)
INSERT INTO public.battery_fitments (vehicle_make, vehicle_model, variant, fuel_type, recommended_ah, battery_product_id)
VALUES
    ('Maruti Suzuki', 'Swift', 'VXi', 'Petrol', 35, 'b1000000-0000-0000-0000-000000000001'),
    ('Hyundai', 'Creta', 'SX Tech', 'Diesel', 45, 'b1000000-0000-0000-0000-000000000002'),
    ('Mahindra', 'Bolero', 'ZLX', 'Diesel', 65, 'b1000000-0000-0000-0000-000000000003'),
    ('Tata', 'Nexon', 'XZ+', 'Petrol', 35, 'b1000000-0000-0000-0000-000000000004'),
    ('Honda', 'Activa 6G', 'DLX', 'Petrol', 5, 'b1000000-0000-0000-0000-000000000007'),
    ('Toyota', 'Innova Crysta', '2.4 GX', 'Diesel', 74, 'b1000000-0000-0000-0000-000000000005');
