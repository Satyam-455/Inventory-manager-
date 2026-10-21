import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { Profile, Customer, UserRole } from '../types';

interface AuthContextType {
  user: Profile | null;
  customer: Customer | null;
  loading: boolean;
  login: (emailOrPhone: string, password?: string) => Promise<void>;
  register: (name: string, phone: string, email: string, address?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRoleDemo: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const profile = await authService.getCurrentProfile();
        setUser(profile);
        if (profile?.role === 'CUSTOMER') {
          const res = await authService.login(profile.phone || profile.name);
          setCustomer(res.customer || null);
        }
      } catch (err) {
        console.error('Failed to load auth user:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (emailOrPhone: string, password?: string) => {
    setLoading(true);
    try {
      const res = await authService.login(emailOrPhone, password);
      setUser(res.profile);
      setCustomer(res.customer || null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, phone: string, email: string, address?: string) => {
    setLoading(true);
    try {
      const res = await authService.registerCustomer(name, phone, email, address);
      setUser(res.profile);
      setCustomer(res.customer);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const switchRoleDemo = async (role: UserRole) => {
    if (role === 'ADMIN') {
      await login('admin@batterypos.in');
    } else {
      await login('rahul.sharma@gmail.com');
    }
  };

  return (
    <AuthContext.Provider value={{ user, customer, loading, login, register, logout, switchRoleDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
