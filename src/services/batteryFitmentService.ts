import { localDb } from '../lib/supabase';
import { BatteryProduct, BatteryFitment, Vehicle } from '../types';

export const batteryFitmentService = {
  /**
   * Recommends matching battery products for a given vehicle based on make, model, fuel type, and Ah requirement.
   */
  async getRecommendationsForVehicle(vehicle: Partial<Vehicle>): Promise<{
    recommendedAh: number;
    exactMatches: BatteryProduct[];
    alternativeMatches: BatteryProduct[];
  }> {
    const fitments = localDb.getFitments();
    const batteries = localDb.getBatteries();
    const activeBatteries = batteries.filter(b => b.is_active);

    // Look for exact fitment rule match
    const fitmentMatch = fitments.find(f => 
      f.vehicle_make.toLowerCase() === vehicle.make?.toLowerCase() &&
      f.vehicle_model.toLowerCase() === vehicle.model?.toLowerCase()
    );

    let recommendedAh = fitmentMatch ? fitmentMatch.recommended_ah : 35; // Default 35 Ah for hatchback/sedan

    if (!fitmentMatch) {
      // Dynamic fallback estimation by vehicle type & fuel
      if (vehicle.make?.toLowerCase().includes('mahindra') || vehicle.fuel_type === 'Diesel') {
        recommendedAh = 65;
      } else if (vehicle.make?.toLowerCase().includes('honda') && vehicle.model?.toLowerCase().includes('activa')) {
        recommendedAh = 5;
      } else if (vehicle.make?.toLowerCase().includes('toyota')) {
        recommendedAh = 74;
      }
    }

    const exactMatches = activeBatteries.filter(b => b.ah === recommendedAh);
    const alternativeMatches = activeBatteries.filter(b => Math.abs(b.ah - recommendedAh) <= 15 && b.ah !== recommendedAh);

    return {
      recommendedAh,
      exactMatches,
      alternativeMatches
    };
  },

  recommendForVehicle(modelName?: string, allBatteries: BatteryProduct[] = []): BatteryProduct[] {
    if (!modelName) return allBatteries;
    const m = modelName.toLowerCase();
    let targetAh = 35;
    if (m.includes('creta') || m.includes('harrier') || m.includes('scorpio') || m.includes('fortuner')) {
      targetAh = 65;
    } else if (m.includes('activa') || m.includes('jupiter') || m.includes('pulsar')) {
      targetAh = 5;
    } else if (m.includes('innova') || m.includes('safari')) {
      targetAh = 74;
    }
    const matches = allBatteries.filter(b => b.ah === targetAh);
    return matches.length > 0 ? matches : allBatteries;
  }
};
