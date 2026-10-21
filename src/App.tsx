import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Layouts
import { AdminLayout } from './layouts/AdminLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { PrivacyPage } from './pages/auth/PrivacyPage';
import { TermsPage } from './pages/auth/TermsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CustomerManagement } from './pages/admin/CustomerManagement';
import { CustomerDetail } from './pages/admin/CustomerDetail';
import { VehicleManagement } from './pages/admin/VehicleManagement';
import { BatteryCatalog } from './pages/admin/BatteryCatalog';
import { InventoryManagement } from './pages/admin/InventoryManagement';
import { NewSaleFlow } from './pages/admin/NewSaleFlow';
import { SalesList } from './pages/admin/SalesList';
import { SaleDetail } from './pages/admin/SaleDetail';
import { WarrantyManagement } from './pages/admin/WarrantyManagement';
import { InvoiceManagement } from './pages/admin/InvoiceManagement';
import { OffersManagement } from './pages/admin/OffersManagement';
import { SettingsPage } from './pages/admin/SettingsPage';

// Customer Pages
import { CustomerHome } from './pages/customer/CustomerHome';
import { CustomerVehicles } from './pages/customer/CustomerVehicles';
import { CustomerBatteries } from './pages/customer/CustomerBatteries';
import { CustomerPurchases } from './pages/customer/CustomerPurchases';
import { CustomerWarranty } from './pages/customer/CustomerWarranty';
import { CustomerOffers } from './pages/customer/CustomerOffers';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Hero Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Pages wrapped in AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="vehicles" element={<VehicleManagement />} />
            <Route path="batteries" element={<BatteryCatalog />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="sales/new" element={<NewSaleFlow />} />
            <Route path="sales" element={<SalesList />} />
            <Route path="sales/:id" element={<SaleDetail />} />
            <Route path="warranties" element={<WarrantyManagement />} />
            <Route path="invoices" element={<InvoiceManagement />} />
            <Route path="offers" element={<OffersManagement />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Protected Customer Routes */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRole="CUSTOMER">
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CustomerHome />} />
            <Route path="vehicles" element={<CustomerVehicles />} />
            <Route path="batteries" element={<CustomerBatteries />} />
            <Route path="purchases" element={<CustomerPurchases />} />
            <Route path="warranty" element={<CustomerWarranty />} />
            <Route path="offers" element={<CustomerOffers />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
