// backend/src/core/domain/FuelConstants.ts

export const REGULATION = {
  // 2025 Target: 2% reduction from 91.16 reference
  TARGET_2025: 89.3368, 
  PENALTY_RATE_EUR: 2400,
  VLSFO_LCV: 41000, // MJ/t
};

export const GWP = {
  CO2: 1,
  CH4: 25,
  N2O: 298,
};

export enum FuelType {
  HFO = 'HFO',
  LFO = 'LFO',
  MDO = 'MDO',
  LNG_OTTO = 'LNG_OTTO', // Dual Fuel Medium Speed
  BIO_DIESEL = 'BIO_DIESEL',
  E_METHANOL = 'E_METHANOL',
}

export interface FuelFactors {
  lcv: number;          // MJ/g
  wtt: number;          // gCO2eq/MJ
  ttw_co2: number;      // g/gFuel
  ttw_ch4: number;      // g/gFuel
  ttw_n2o: number;      // g/gFuel
  reward_factor: number; // 1 for fossil/bio, 2 for RFNBO
}

// Source: FuelEU Annex II & PDF Report
export const FUEL_DATA: Record<FuelType, FuelFactors> = {
  [FuelType.HFO]: { lcv: 0.0405, wtt: 13.5, ttw_co2: 3.114, ttw_ch4: 0.00005, ttw_n2o: 0.00018, reward_factor: 1 },
  [FuelType.LFO]: { lcv: 0.0410, wtt: 13.2, ttw_co2: 3.151, ttw_ch4: 0.00005, ttw_n2o: 0.00018, reward_factor: 1 },
  [FuelType.MDO]: { lcv: 0.0427, wtt: 14.4, ttw_co2: 3.206, ttw_ch4: 0.00005, ttw_n2o: 0.00018, reward_factor: 1 },
  [FuelType.LNG_OTTO]: { lcv: 0.0491, wtt: 18.5, ttw_co2: 2.750, ttw_ch4: 0.0, ttw_n2o: 0.00011, reward_factor: 1 },
  [FuelType.BIO_DIESEL]: { lcv: 0.0370, wtt: 14.9, ttw_co2: 2.834, ttw_ch4: 0.00005, ttw_n2o: 0.00018, reward_factor: 1 },
  [FuelType.E_METHANOL]: { lcv: 0.0199, wtt: 10.0, ttw_co2: 1.375, ttw_ch4: 0.00005, ttw_n2o: 0.00018, reward_factor: 2 },
};