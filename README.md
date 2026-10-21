🔋 PowerDrive — Battery Shop Management & Digital Warranty Platform
A modern, full-stack Point of Sale (POS), Inventory Control, and Digital Warranty platform tailored specifically for automotive & inverter battery retailers.

📖 Table of Contents


What is This Project?


Key Problems It Solves


Core Features


User Roles & Portals


Tech Stack


Folder & File Structure


Getting Started (Run Locally)


Demo Login Credentials


How It Works (Step-by-Step Workflows)


Database Architecture & Schema


Supabase Cloud Setup (Optional)


Available NPM Commands
💡 What is This Project?
PowerDrive Battery Shop Manager is a specialized retail software designed for battery shops (selling brands like Exide, Amaron, SF Sonic, Luminous, Tata Green).

Unlike a generic grocery or clothing POS, this system handles automotive-specific workflows such as:

Vehicle RC Lookups to recommend exact battery models and Ah capacities.
Scrap Battery / Trade-In Discounts (exchanging the old dead battery for cash value).
Automated Digital Warranty Cards that never get lost.
Instant WhatsApp Invoice Delivery to customers with a single click.
Customer Self-Service Portal where car owners can check their warranty status anytime.
⚡ Key Problems It Solves
Traditional Battery Shop Issues	PowerDrive Solution
Lost Warranty Cards: Customers lose paper receipts and dispute warranty validity.	Digital Warranty Code: Automatically generated, recorded in database with expiry dates.
Wrong Battery Fitment: Recommending the wrong Ah or physical size for a car.	Smart Fitment Engine: Matches car make/model/variant with compatible batteries.
Stock Discrepancies: Selling items without tracking scrap or current shelf quantity.	Automated Inventory Logs: Stocks auto-decrement on sale; low-stock alert badges appear.
Old Battery Scrap Value: Confusion on billing discounts for exchanged old batteries.	Built-in Trade-In Counter: Dedicated line-item deduction for old scrap battery exchange.
Manual Paper Invoicing: Handwriting carbon-copy bills is slow and looks outdated.	1-Click PDF & WhatsApp: Generate PDF invoices and send direct WhatsApp links.
🌟 Core Features
1. 🛒 Multi-Step POS Sales Flow
Step 1 — Customer Identification: Select an existing customer or quick-create a new one with phone number.
Step 2 — Vehicle Matching: Search vehicle registration number or pick a saved vehicle.
Step 3 — Battery Selection & Fitment: Recommended batteries highlight automatically based on vehicle fuel type & Ah requirement.
Step 4 — Pricing & Scrap Exchange: Automatic calculation of subtotal, scrap battery trade-in discount (e.g., ₹500 off for old battery), taxes, and total.
Step 5 — Instant Receipt & Celebration: Completes the sale with celebratory confetti, updates stock, issues warranty, and generates invoice.
2. 🛡️ Digital Warranty Management
Unique warranty codes (e.g., WRN-EXI-84920).
Color-coded live status:
🟢 ACTIVE (Valid warranty)
🟡 EXPIRING SOON (Within 30–60 days of expiry)
🔴 EXPIRED (Warranty has lapsed)
Detailed customer, vehicle, and sale linkage for rapid verification during claim requests.
3. 📦 Real-Time Inventory & Stock Audit
Real-time stock counts for every battery SKU.
Custom low-stock thresholds with warning badges when stock drops below threshold.
Stock adjustments log (Audit Trail: records when stock was added IN, sold OUT, or adjusted ADJUSTMENT).
4. 📄 Invoicing & Instant WhatsApp Sharing
Built-in PDF invoice generator (jspdf + jspdf-autotable).
WhatsApp Business click-to-chat integration: sends pre-formatted invoice summary links directly to the customer's mobile number.
5. 🔄 Zero-Config Dual Persistence Engine
Local Mode (Default): Runs out of the box using browser localStorage populated with rich realistic mock data. No database setup required to start using it!
Cloud Mode (Supabase): Ready to connect to Supabase PostgreSQL with pre-written schema, Row Level Security (RLS) policies, and indexes.
👥 User Roles & Portals
The application features two separate user experiences protected by an Authentication Guard:

                      ┌───────────────────────┐
                      │   Landing Page (/)    │
                      └───────────┬───────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
      ┌──────────────────────┐          ┌──────────────────────┐
      │   Admin Portal       │          │   Customer Portal    │
      │   (/admin)           │          │   (/customer)        │
      ├──────────────────────┤          ├──────────────────────┤
      │ • Shop Dashboard     │          │ • My Vehicles        │
      │ • New POS Sale Flow  │          │ • My Battery Info    │
      │ • Inventory Control  │          │ • Digital Warranties │
      │ • Warranty Registry  │          │ • Invoices & History │
      │ • Customer Directory │          │ • Exclusive Offers   │
      │ • Invoices & Offers  │          │                      │
      └──────────────────────┘          └──────────────────────┘
🛠️ Tech Stack
Frontend Library: React 18 + TypeScript
Build Tool: Vite (Instant hot-reloading)
Styling: Tailwind CSS v3
Icons: Lucide React (Clean, modern icons)
Routing: React Router v6
PDF Generation: jsPDF & jspdf-autotable
UI FX: Canvas Confetti
Database / Backend: Supabase (PostgreSQL + Auth + Row Level Security)
Local Fallback: Custom LocalStorage Sync Engine (localDb)
📁 Folder & File Structure
Here is how the project is organized:

BATTERY INFO/
├── supabase/
│   ├── schema.sql           # Complete PostgreSQL tables, RLS policies & indexes
│   └── seed.sql             # Sample starter data (Batteries, Customers, Vehicles)
│
├── src/
│   ├── App.tsx              # Main routing hub (Admin, Customer, and Auth routes)
│   ├── main.tsx             # React entry point
│   ├── index.css            # Tailwind directives and global styles
│   │
│   ├── context/
│   │   └── AuthContext.tsx  # User session state & 1-click role switcher
│   │
│   ├── services/
│   │   ├── authService.ts           # Login/register and role assignments
│   │   ├── saleService.ts           # Sale creation, price math, stock reduction
│   │   ├── inventoryService.ts      # Stock counting and transaction audit logs
│   │   ├── vehicleLookupService.ts  # Vehicle RC number parsing & lookup simulation
│   │   ├── batteryFitmentService.ts # Matches vehicle models with battery specs
│   │   └── whatsappService.ts       # Generates wa.me click-to-chat links
│   │
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client + LocalStorage fallback engine
│   │   └── mockData.ts      # Initial pre-seeded data for offline demo
│   │
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces (Sale, Warranty, Battery, etc.)
│   │
│   ├── layouts/
│   │   ├── AdminLayout.tsx    # Sidebar, top bar, & navigation for Shop Owner
│   │   ├── CustomerLayout.tsx # Navigation for Vehicle Owners
│   │   └── AuthLayout.tsx     # Clean centered layout for Login/Register
│   │
│   └── pages/
│       ├── LandingPage.tsx          # Homepage with quick demo buttons
│       ├── admin/
│       │   ├── AdminDashboard.tsx      # Revenue stats, expiring warranties, alerts
│       │   ├── NewSaleFlow.tsx         # 5-step billing counter flow
│       │   ├── InventoryManagement.tsx # Stock levels & adjustment modal
│       │   ├── BatteryCatalog.tsx      # Add/edit battery products & Ah capacity
│       │   ├── CustomerManagement.tsx  # Customer CRM table & search
│       │   ├── CustomerDetail.tsx      # Deep dive into customer's cars & bills
│       │   ├── VehicleManagement.tsx   # All registered customer vehicles
│       │   ├── WarrantyManagement.tsx  # Warranty search, codes & status filters
│       │   ├── SalesList.tsx           # History of all completed sales
│       │   ├── SaleDetail.tsx          # Detailed bill breakdown
│       │   ├── InvoiceManagement.tsx   # PDF download and print receipts
│       │   ├── OffersManagement.tsx    # Manage discount vouchers
│       │   └── SettingsPage.tsx        # Shop profile & GSTIN configuration
│       │
│       └── customer/
│           ├── CustomerHome.tsx        # Customer overview & active battery health
│           ├── CustomerVehicles.tsx    # Saved vehicles
│           ├── CustomerBatteries.tsx   # Current installed battery details
│           ├── CustomerWarranty.tsx    # Digital warranty cards
│           ├── CustomerPurchases.tsx   # Past invoices & downloads
│           └── CustomerOffers.tsx      # Active promotions
│
├── .env                     # Environment variables for Supabase connection
├── package.json             # Project dependencies and npm scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript compiler configuration
└── vite.config.ts           # Vite bundler configuration
