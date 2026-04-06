export interface Country {
  code: string;
  name: string;
  flag: string;
  import_rank: number;
  reciprocal_tariff_rate: number;
  section_301_applies: boolean;
  section_301_rate_range: [number, number] | null;
  de_minimis_eligible: boolean;
  trade_agreement: string | null;
  notes: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  base_mfn_rate: number;
  section_301_rate_china: number;
  section_232_applies: boolean;
  section_232_rate?: number;
  examples: string;
}

export interface TariffResult {
  productValue: number;
  baseDuty: number;
  baseDutyRate: number;
  reciprocalDuty: number;
  reciprocalRate: number;
  section301Duty: number;
  section301Rate: number;
  section232Duty: number;
  section232Rate: number;
  mpf: number;
  hmf: number;
  totalDuty: number;
  effectiveRate: number;
  totalLandedCost: number;
  deMinimisEligible: boolean;
  tradeAgreement: string | null;
  countryNotes: string;
}

export interface CountriesData {
  last_updated: string;
  countries: Country[];
}

export interface CategoriesData {
  categories: Category[];
}
