import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Battery, 
  Package, 
  ShoppingCart, 
  PlusCircle, 
  ShieldCheck, 
  FileText, 
  Tag, 
  Settings, 
  LogOut, 
  Search, 
  UserCheck, 
  Menu, 
  X,
  Bell
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, switchRoleDemo } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/sales/new', label: 'New Sale', icon: PlusCircle, badge: 'Quick' },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/vehicles', label: 'Vehicles', icon: Car },
    { to: '/admin/batteries', label: 'Battery Catalog', icon: Battery },
    { to: '/admin/inventory', label: 'Inventory Stock', icon: Package },
    { to: '/admin/sales', label: 'Sales History', icon: ShoppingCart },
    { to: '/admin/warranties', label: 'Warranties', icon: ShieldCheck },
    { to: '/admin/invoices', label: 'Invoices & Billing', icon: FileText },
    { to: '/admin/offers', label: 'Shop Offers', icon: Tag },
    { to: '/admin/settings', label: 'Shop Settings', icon: Settings },
  ];

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/admin/customers?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg">
            <Battery className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide text-base leading-tight">PowerDrive</h1>
            <p className="text-xs text-brand-400 font-medium">Battery Shop POS</p>
          </div>
        </div>

        {/* Demo Role Quick Switcher */}
        <div className="p-3 mx-3 my-3 bg-slate-800/80 rounded-lg border border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Demo Mode</span>
            <span className="bg-brand-500/20 text-brand-300 text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase">Admin</span>
          </div>
          <button
            onClick={() => switchRoleDemo('CUSTOMER')}
            className="w-full text-left text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 py-1.5 px-2.5 rounded flex items-center justify-between transition-colors"
          >
            <span>Switch to Customer App</span>
            <UserCheck className="w-3.5 h-3.5 text-brand-400" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 text-xs text-slate-400">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 truncate">
              <p className="font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[11px] text-emerald-400">Shop Admin</p>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <form onSubmit={handleGlobalSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers by name, phone, or registration (e.g. UP70AB1234)..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-brand-50 text-brand-700 border border-brand-200/60 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live POS Active
            </div>

            <button 
              onClick={() => switchRoleDemo('CUSTOMER')}
              className="md:hidden text-xs bg-slate-800 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-medium"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 text-slate-300 border-b border-slate-800 px-4 py-3 space-y-1 z-40">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">{user?.name} (Admin)</span>
              <button
                onClick={() => logout()}
                className="text-xs text-rose-400 font-semibold px-2 py-1 hover:bg-slate-800 rounded"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Page View Body */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
