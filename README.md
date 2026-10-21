# 🔋 PowerDrive — Battery Shop Management & Digital Warranty Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel_Hosted-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://inventory-manager-six-topaz.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

> A modern, production-ready Point of Sale (POS), Real-Time Inventory Control, and Digital Warranty platform designed specifically for automotive and inverter battery retailers.

🔗 **Live Deployment:** [https://inventory-manager-six-topaz.vercel.app/](https://inventory-manager-six-topaz.vercel.app/)

---

## 📌 Table of Contents

- [🌟 Live Demo & Quick Access](#-live-demo--quick-access)
- [💡 Why PowerDrive?](#-why-powerdrive)
- [✨ Key Features](#-key-features)
- [👥 User Portals & Roles](#-user-portals--roles)
- [🔑 Demo Login Credentials](#-demo-login-credentials)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Local Development Setup](#-local-development-setup)
- [🗄️ Database & Supabase Setup](#️-database--supabase-setup)
- [⚡ How Main Workflows Work](#-how-main-workflows-work)
- [📄 Available Scripts](#-available-scripts)

---

## 🌟 Live Demo & Quick Access

The application is deployed on Vercel and fully interactive:

👉 **[Launch Live Web App](https://inventory-manager-six-topaz.vercel.app/)**

> 💡 **Tip:** On the landing page, you can use the **1-Click Demo Buttons** (`Admin Portal` or `Customer Demo`) to immediately test all features without manually typing passwords!

---

## 💡 Why PowerDrive?

General retail software often fails for battery businesses because battery sales have unique requirements:
1. **Lost Paper Warranty Cards:** Customers regularly lose physical paper warranty receipts and dispute claim validity months later.
2. **Old Battery Scrap Value (Trade-In):** Almost every car battery sale involves exchanging the dead battery for a scrap discount (typically ₹400–₹1,000 in India).
3. **Fitment Complexity:** Batteries must match vehicle specifications (Ah capacity, terminal layout, physical dimensions, fuel type).
4. **Manual Receipts:** Handwritten bills lack GST standardization, cannot be easily verified, and are easily lost.

**PowerDrive** solves all these challenges with automated digital warranties, a vehicle recommendation engine, scrap exchange deductions, and 1-click WhatsApp PDF invoice sharing.

---

## ✨ Key Features

### 🛒 1. Guided POS Sales Counter
- **5-Step Billing Workflow:** Customer Identification ➔ Vehicle Matching ➔ Battery Specification Matching ➔ Scrap Trade-In Calculation ➔ Receipt Generation.
- **Old Battery Scrap Discount:** Dedicated trade-in discount deduction for exchanging old dead batteries.
- **Multi-Payment Modes:** Supports UPI/GPay, Cash, Credit Card, Debit Card, and Net Banking.
- **Celebratory UI:** Integrated confetti animation upon successful sale completion.

### 🛡️ 2. Automated Digital Warranty System
- **Unique Warranty Codes:** Automatically generated alphanumeric warranty codes (e.g., `WRN-AMR-2024-819`).
- **Live Health & Status Badges:**
  - 🟢 **ACTIVE:** Valid warranty period.
  - 🟡 **EXPIRING SOON:** Within 30–60 days of expiration.
  - 🔴 **EXPIRED:** Warranty period elapsed.
- **Instant Claim Verification:** Search by warranty code, car registration number, or customer phone number.

### 📦 3. Real-Time Stock & Inventory Management
- **Automated Stock Deductions:** Shelf stock decrements automatically when a sale is finalized.
- **Low Stock Alerts:** Visual warning badges when stock falls below configurable thresholds.
- **Stock Audit Logs:** Complete transaction log tracking additions (`IN`), sales (`OUT`), and manual count adjustments (`ADJUSTMENT`).

### 📄 4. PDF Invoicing & Instant WhatsApp Sharing
- **Dynamic PDF Invoices:** Built-in PDF generation with company header, GSTIN, itemized battery details, scrap discounts, and warranty terms.
- **1-Click WhatsApp Sharing:** Uses the WhatsApp Business API click-to-chat URL scheme to send receipts directly to customer phone numbers.

### 🚗 5. Vehicle Lookup & Recommendation Engine
- **RC / Registration Number Parser:** Cleans and normalizes registration numbers with smart make/model identification.
- **Battery Fitment Matrix:** Recommends exact battery Ah ratings (e.g., 35Ah for Petrol Hatchbacks, 65Ah for Diesel SUVs, 150Ah for Inverters).

### 🔄 6. Dual Persistence Engine (Offline-First + Cloud-Ready)
- **Zero-Config LocalStorage Engine (`localDb`):** Works 100% out of the box with zero setup needed.
- **Supabase PostgreSQL Ready:** Pre-built PostgreSQL schema with Row Level Security (RLS) policies and seed data.

---

## 👥 User Portals & Roles

```
                              ┌─────────────────────────────────┐
                              │  PowerDrive Landing Page (/)    │
                              │ https://inventory-manager-six-  │
                              │       topaz.vercel.app/         │
                              └────────────────┬────────────────┘
                                               │
                      ┌────────────────────────┴────────────────────────┐
                      ▼                                                 ▼
        ┌───────────────────────────┐                     ┌───────────────────────────┐
        │       Admin Portal        │                     │      Customer Portal      │
        │         (/admin)          │                     │        (/customer)        │
        ├───────────────────────────┤                     ├───────────────────────────┤
        │ • Analytics & Revenue     │                     │ • Registered Vehicles     │
        │ • Step-by-Step POS Sale   │                     │ • Active Battery Health   │
        │ • Inventory Control       │                     │ • Digital Warranty Cards  │
        │ • Warranty Claims Registry│                     │ • Invoices & Receipts     │
        │ • Customer & Vehicle CRM  │                     │ • Exclusive Offers        │
        │ • Offers & Shop Settings  │                     │                           │
        └───────────────────────────┘                     └───────────────────────────┘
```

---

## 🔑 Demo Login Credentials

You can test either portal directly on the [Live Site](https://inventory-manager-six-topaz.vercel.app/) or in your local setup:

| Portal | Role | Email / Identifier | Password | Access Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Shop Owner | `admin@batterypos.in` *(or click "Admin Portal")* | *(Any / Demo)* | Full access to POS counter, inventory audit, warranty ledger, sales reports, and settings. |
| **Customer** | Car Owner | `rahul.sharma@gmail.com` *(or click "Customer Demo")* | *(Any / Demo)* | Personal dashboard with Maruti Swift details, Amaron battery warranty, and downloadable invoices. |

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build System:** [Vite](https://vitejs.dev/) (Rapid HMR & optimized production bundling)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) + [PostCSS](https://postcss.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Document Generation:** [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **UI FX:** [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Cloud Database:** [Supabase](https://supabase.com/) (PostgreSQL + RLS Policies + UUID extensions)
- **Hosting:** [Vercel](https://vercel.com/)

---

## 📁 Project Structure

```
├── supabase/
│   ├── schema.sql           # PostgreSQL tables, RLS policies, functions, & indexes
│   └── seed.sql             # Starter dataset (batteries, cars, sales, warranties)
│
├── src/
│   ├── App.tsx              # Main application router and auth guard structure
│   ├── main.tsx             # React DOM root entry
│   ├── index.css            # Tailwind directives and custom UI scrollbars
│   │
│   ├── context/
│   │   └── AuthContext.tsx  # Authentication provider & fast role switching
│   │
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client + LocalStorage synchronization engine
│   │   └── mockData.ts      # Starter demo data for offline execution
│   │
│   ├── services/
│   │   ├── authService.ts           # Authentication logic
│   │   ├── saleService.ts           # Order calculation, stock decrement, invoice creation
│   │   ├── inventoryService.ts      # Stock management & transaction history logs
│   │   ├── vehicleLookupService.ts  # Vehicle registration number parser
│   │   ├── batteryFitmentService.ts # Vehicle-to-battery matching rules
│   │   ├── whatsappService.ts       # WhatsApp click-to-chat URL generator
│   │   └── notificationService.ts   # In-app toast & alert dispatcher
│   │
│   ├── types/
│   │   └── index.ts         # TypeScript models (Sale, Warranty, Product, Customer)
│   │
│   ├── layouts/
│   │   ├── AdminLayout.tsx    # Admin sidebar, navigation, and header
│   │   ├── CustomerLayout.tsx # Customer dashboard layout
│   │   └── AuthLayout.tsx     # Centered authentication shell
│   │
│   └── pages/
│       ├── LandingPage.tsx          # Public showcase & demo switcher
│       ├── admin/
│       │   ├── AdminDashboard.tsx      # Metrics, revenue, low stock alerts
│       │   ├── NewSaleFlow.tsx         # 5-step billing counter (POS)
│       │   ├── InventoryManagement.tsx # Shelf stock & adjustment logs
│       │   ├── BatteryCatalog.tsx      # Add/edit batteries, SKUs, and Ah
│       │   ├── CustomerManagement.tsx  # Customer CRM table
│       │   ├── CustomerDetail.tsx      # Detailed customer profile & vehicle list
│       │   ├── VehicleManagement.tsx   # Registered vehicle directory
│       │   ├── WarrantyManagement.tsx  # Searchable warranty registry
│       │   ├── SalesList.tsx           # Order transaction history
│       │   ├── SaleDetail.tsx          # Line-item bill breakdown
│       │   ├── InvoiceManagement.tsx   # PDF download and print hub
│       │   ├── OffersManagement.tsx    # Promotional discount campaigns
│       │   └── SettingsPage.tsx        # Shop profile & GSTIN configuration
│       │
│       └── customer/
│           ├── CustomerHome.tsx        # Customer vehicle overview
│           ├── CustomerVehicles.tsx    # Customer's registered cars/bikes
│           ├── CustomerBatteries.tsx   # Installed battery specifications
│           ├── CustomerWarranty.tsx    # Digital warranty card download
│           ├── CustomerPurchases.tsx   # Past invoices
│           └── CustomerOffers.tsx      # Discount coupons
│
├── .env                     # Supabase environment variables
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Custom color palettes and themes
├── tsconfig.json            # TypeScript compiler configuration
└── vite.config.ts           # Vite configuration
```

---

## 🚀 Local Development Setup

To run the application locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/Satyam-455/Inventory-manager-.git
cd Inventory-manager-
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The application will be live at:
```
http://localhost:5173
```

*(No backend configuration is required to test locally — the app will automatically boot with local mock data!)*

---

## 🗄️ Database & Supabase Setup

To link your own cloud PostgreSQL database via Supabase:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard:
   - Execute the SQL in [`supabase/schema.sql`](supabase/schema.sql).
   - *(Optional)* Execute the sample data in [`supabase/seed.sql`](supabase/seed.sql).
3. Copy your project credentials from **Project Settings ➔ API**.
4. Update your local [`.env`](.env) file:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Restart your server (`npm run dev`).

---

## ⚡ How Main Workflows Work

### 1. Counter Sale & Billing (POS)
1. Staff opens **New Sale (POS)** in the Admin sidebar.
2. Search customer by phone number or create a quick record on the fly.
3. Select or enter the vehicle registration number (e.g., `UP70-AB-1234`).
4. Recommended batteries highlight automatically (matching Ah capacity & dimensions).
5. Enter the **Old Battery Scrap Exchange Value** (e.g., ₹500 discount).
6. Pick payment method (Cash / UPI / Card) and finalize.
7. The system:
   - Deducts stock immediately.
   - Creates a unique Digital Warranty (e.g., 36-month validity).
   - Generates a PDF invoice with shop GSTIN.
   - Provides a 1-click button to send the receipt via **WhatsApp**.

### 2. Digital Warranty Verification
1. A customer returns with a battery issue.
2. Staff searches the **Warranty Registry** by:
   - Customer mobile number
   - Vehicle registration number
   - Warranty code on the battery
3. The platform instantly displays whether the warranty is **Active**, **Expiring Soon**, or **Expired**, along with exact purchase dates and vehicle alignment.

---

## 📄 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with Hot Module Replacement. |
| `npm run build` | Compiles TypeScript and builds production artifacts into `/dist`. |
| `npm run lint` | Runs TypeScript compiler checks (`tsc --noEmit`) to verify strict typing. |
| `npm run preview` | Spins up a local web server to test the production build locally. |

---

## 🌐 Deployment Details

- **Hosting Platform:** Vercel
- **Production URL:** [https://inventory-manager-six-topaz.vercel.app/](https://inventory-manager-six-topaz.vercel.app/)
- **Automatic Deployments:** Linked directly to the main GitHub repository branch.

---

## 👨‍💻 Author & Acknowledgments

- **Repository:** [Satyam-455/Inventory-manager-](https://github.com/Satyam-455/Inventory-manager-)
- Built for modern automotive retail shops, providing seamless digital transitions from paper billing to automated warranties and stock management.
