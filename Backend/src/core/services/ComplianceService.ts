// backend/src/core/services/ComplianceService.ts
import { REGULATION, GWP, FUEL_DATA, FuelType } from '../domain/FuelConstants';

export interface VoyageInput {
  id: string;
  fuelType: FuelType;
  mass_tonnes: number;
  slip_percent?: number; // Specific for LNG
}

export class ComplianceService {
  
  /**
   * Calculates GHG Intensity, Compliance Balance, and Penalty.
   * Formula Ref: ESSF Report Section 1.2 & 1.3
   */
  public calculateKPIs(voyages: VoyageInput[]) {
    let total_energy_mj = 0;
    let total_wtt_emissions = 0;
    let total_ttw_emissions = 0;
    let total_energy_denominator = 0; // Adjusted for RFNBO multiplier

    voyages.forEach(v => {
      // Safe fallback if fuel type isn't in our dictionary
      const f = FUEL_DATA[v.fuelType] || FUEL_DATA[FuelType.HFO];
      
      const mass_g = v.mass_tonnes * 1_000_000; // Convert tonnes to grams
      const energy_mj = mass_g * f.lcv;

      total_energy_mj += energy_mj;
      
      // RFNBO Reward Factor (Multiplier of 2 in denominator)
      total_energy_denominator += energy_mj * f.reward_factor;

      // WtT Calculation
      total_wtt_emissions += energy_mj * f.wtt;

      // TtW Calculation (Combustion + Slip)
      const slip = (v.slip_percent || 0) / 100;
      const combustion_emissions = (1 - slip) * (f.ttw_co2 * GWP.CO2 + f.ttw_ch4 * GWP.CH4 + f.ttw_n2o * GWP.N2O);
      const slip_emissions = slip * (1 * GWP.CH4); // Slip is pure Methane
      
      total_ttw_emissions += mass_g * (combustion_emissions + slip_emissions);
    });

    // Avoid division by zero
    if (total_energy_denominator === 0) return { ghgie_actual: 0, cb_gco2eq: 0, penalty_eur: 0, is_compliant: true };

    const ghgie_actual = (total_wtt_emissions + total_ttw_emissions) / total_energy_denominator;
    
    // Compliance Balance = (Target - Actual) * Total Energy
    const cb_gco2eq = (REGULATION.TARGET_2025 - ghgie_actual) * total_energy_mj;

    // Penalty Calculation
    let penalty = 0;
    if (cb_gco2eq < 0) {
      const abs_deficit = Math.abs(cb_gco2eq);
      // Convert deficit to tonnes of VLSFO equivalent
      const vlsfo_eq = abs_deficit / (ghgie_actual * REGULATION.VLSFO_LCV);
      penalty = Math.floor(vlsfo_eq * REGULATION.PENALTY_RATE_EUR);
    }

    return {
      ghgie_actual,
      cb_gco2eq,
      penalty_eur: penalty,
      is_compliant: cb_gco2eq >= 0
    };
  }
}