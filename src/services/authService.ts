import { localDb, supabase } from '../lib/supabase';
import { Profile, Customer, UserRole } from '../types';

export const authService = {
  async login(emailOrPhone: string, password?: string): Promise<{ profile: Profile; customer?: Customer | null }> {
    const input = emailOrPhone.trim().toLowerCase();
    
    // Check if logging in as Admin
    if (input.includes('admin') || input === 'admin@batterypos.in' || input === '+919839012345') {
      const adminProfile: Profile = {
        id: 'p0',
        auth_user_id: 'admin-auth-id',
        role: 'ADMIN',
        name: 'Rajesh Agarwal (Shop Owner)',
        phone: '+91 98390 12345',
        created_at: new Date().toISOString()
      };
      localDb.setCurrentUser(adminProfile);
      return { profile: adminProfile, customer: null };
    }

    // Customer login matching phone/email/name
    const customers = localDb.getCustomers();
    const customer = customers.find(c => 
      c.email?.toLowerCase() === input || 
      c.phone.replace(/[^0-9]/g, '').includes(input.replace(/[^0-9]/g, '')) ||
      c.name.toLowerCase().includes(input)
    );

    if (customer) {
      const customerProfile: Profile = {
        id: customer.profile_id || `prof-${customer.id}`,
        auth_user_id: `auth-${customer.id}`,
        role: 'CUSTOMER',
        name: customer.name,
        phone: customer.phone,
        created_at: customer.created_at
      };
      localDb.setCurrentUser(customerProfile);
      return { profile: customerProfile, customer };
    }

    // Default Fallback Customer for quick testing
    const defaultCustomer = customers[0];
    const defaultProfile: Profile = {
      id: defaultCustomer.profile_id || 'p1',
      auth_user_id: 'rahul-auth-id',
      role: 'CUSTOMER',
      name: defaultCustomer.name,
      phone: defaultCustomer.phone,
      created_at: defaultCustomer.created_at
    };
    localDb.setCurrentUser(defaultProfile);
    return { profile: defaultProfile, customer: defaultCustomer };
  },

  async registerCustomer(name: string, phone: string, email: string, address?: string): Promise<{ profile: Profile; customer: Customer }> {
    const customers = localDb.getCustomers();
    const newCustomer: Customer = {
      id: `c_${Date.now()}`,
      name,
      phone,
      email,
      address,
      created_at: new Date().toISOString()
    };

    const newProfile: Profile = {
      id: `p_${Date.now()}`,
      role: 'CUSTOMER',
      name,
      phone,
      created_at: new Date().toISOString()
    };

    newCustomer.profile_id = newProfile.id;
    customers.push(newCustomer);
    localDb.saveCustomers(customers);

    const profiles = localDb.getProfiles();
    profiles.push(newProfile);
    localDb.saveProfiles(profiles);

    localDb.setCurrentUser(newProfile);

    return { profile: newProfile, customer: newCustomer };
  },

  async getCurrentProfile(): Promise<Profile | null> {
    return localDb.getCurrentUser();
  },

  async logout(): Promise<void> {
    localStorage.removeItem('battery_current_user_profile');
  }
};
