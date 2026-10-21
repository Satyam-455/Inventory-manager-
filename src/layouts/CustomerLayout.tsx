import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Car, 
  Battery, 
  ShoppingBag, 
  ShieldCheck, 
  Tag, 
  LogOut, 
  FileText,
  UserCheck
} from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const { user, customer, logout, switchRoleDemo } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/customer', label: 'Home', icon: Home, end: true },
    { to: '/customer/vehicles', label: 'Vehicles', icon: Car },
    { to: '/customer/batteries', label: 'Battery', icon: Battery },
    { to: '/customer/purchases', label: 'Orders', icon: ShoppingBag },
    { to: '/customer/warranty', label: 'Warranty', icon: ShieldCheck },
    { to: '/customer/offers', label: 'Offers', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans max-w-md mx-auto sm:max-w-2xl md:max-w-4xl shadow-2xl border-x border-slate-200">
      {/* Top Customer Header */}
      <header className="bg-slate-900 text-white px-4 py-3.5 sticky top-0 z-30 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">
            <Battery className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-wide">PowerDrive</h1>
            <p className="text-[11px] text-emerald-400 font-medium">My Battery Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Demo Switcher */}
          <button
            onClick={() => switchRoleDemo('ADMIN')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-700 transition-colors"
            title="Switch to Admin Dashboard"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Admin Mode</span>
          </button>

          <button
            onClick={() => logout()}
            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 p-4 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Sticky Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto sm:max-w-2xl md:max-w-4xl bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around z-30 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-brand-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-brand-600 scale-110' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
