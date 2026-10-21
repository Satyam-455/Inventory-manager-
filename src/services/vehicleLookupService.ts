import { FuelType, Vehicle } from '../types';

export interface VehicleLookupResult {
  registrationNumber: string;
  make: string;
  model: string;
  variant: string;
  fuelType: FuelType;
  manufacturingYear: number;
  engineNumber?: string;
  chassisNumber?: string;
  ownerName?: string;
  isMockedResponse: boolean;
}

export const vehicleLookupService = {
  /**
   * Service abstraction designed for future RC API integration (e.g. Attestr, CarInfo, Vahan API).
   * For now, normalizes the registration number and returns structured vehicle metadata.
   */
  async lookupByRegistrationNumber(registrationNumber: string): Promise<VehicleLookupResult> {
    const regClean = registrationNumber.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Simulate API network latency (400ms)
    await new Promise(resolve => setTimeout(resolve, 400));

    // Dynamic mock response generator based on Indian RTO registration pattern
    if (regClean.includes('UP70') || regClean.includes('SWIFT')) {
      return {
        registrationNumber: regClean,
        make: 'Maruti Suzuki',
        model: 'Swift',
        variant: 'VXi 1.2L',
        fuelType: 'Petrol',
        manufacturingYear: 2021,
        engineNumber: 'K12M145892',
        chassisNumber: 'MA3FBE31S00984561',
        ownerName: 'Rahul Sharma',
        isMockedResponse: true
      };
    } else if (regClean.includes('CRETA') || regClean.includes('CX9988')) {
      return {
        registrationNumber: regClean,
        make: 'Hyundai',
        model: 'Creta',
        variant: 'SX Tech CRDi',
        fuelType: 'Diesel',
        manufacturingYear: 2022,
        engineNumber: 'D4FA109923',
        chassisNumber: 'MALC181CLNM776654',
        ownerName: 'Priya Verma',
        isMockedResponse: true
      };
    } else if (regClean.includes('BOLERO') || regClean.includes('ET4567')) {
      return {
        registrationNumber: regClean,
        make: 'Mahindra',
        model: 'Bolero',
        variant: 'ZLX Power+ m2DiCR',
        fuelType: 'Diesel',
        manufacturingYear: 2019,
        engineNumber: 'm2DiCR88941',
        chassisNumber: 'MA1TA2BKXK2991122',
        ownerName: 'Amitabh Gupta',
        isMockedResponse: true
      };
    }

    // Default intelligent fallback for any entered reg number
    return {
      registrationNumber: regClean,
      make: 'Tata',
      model: 'Nexon',
      variant: 'XZ+ Revotron',
      fuelType: 'Petrol',
      manufacturingYear: 2022,
      isMockedResponse: true
    };
  }
};
