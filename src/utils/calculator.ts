import { Country, Category, TariffResult } from '../types';

export function calculateTariff(
  country: Country,
  category: Category,
  productValue: number
): TariffResult {
  // 1. Base MFN Duty
  const baseDuty = productValue * (category.base_mfn_rate / 100);

  // 2. Reciprocal Tariff (IEEPA) — skip if USMCA
  let reciprocalDuty = 0;
  let reciprocalRate = country.reciprocal_tariff_rate;
  if (country.trade_agreement === 'USMCA') {
    reciprocalDuty = 0;
    reciprocalRate = 0;
  } else {
    reciprocalDuty = productValue * (country.reciprocal_tariff_rate / 100);
  }

  // 3. Section 301 (China only)
  let section301Duty = 0;
  let section301Rate = 0;
  if (country.code === 'CN' && category.section_301_rate_china > 0) {
    section301Rate = category.section_301_rate_china;
    section301Duty = productValue * (section301Rate / 100);
  }

  // 4. Section 232 (steel, aluminum, autos, copper, lumber, semiconductors)
  let section232Duty = 0;
  let section232Rate = 0;
  if (category.section_232_applies && category.section_232_rate) {
    section232Rate = category.section_232_rate;
    section232Duty = productValue * (section232Rate / 100);
  }

  // 5. Merchandise Processing Fee (MPF)
  let mpf: number;
  if (productValue >= 2500) {
    mpf = Math.max(31.67, Math.min(productValue * 0.003464, 614.35));
  } else {
    mpf = 5.0;
  }

  // 6. Harbor Maintenance Fee (HMF) — ocean shipments
  const hmf = productValue * 0.00125;

  // 7. De Minimis Check
  const deMinimisEligible =
    productValue <= 800 && country.de_minimis_eligible;

  // Totals
  const totalDuty =
    baseDuty + reciprocalDuty + section301Duty + section232Duty + mpf + hmf;
  const effectiveRate = productValue > 0 ? (totalDuty / productValue) * 100 : 0;
  const totalLandedCost = productValue + totalDuty;

  return {
    productValue,
    baseDuty,
    baseDutyRate: category.base_mfn_rate,
    reciprocalDuty,
    reciprocalRate,
    section301Duty,
    section301Rate,
    section232Duty,
    section232Rate,
    mpf,
    hmf,
    totalDuty,
    effectiveRate,
    totalLandedCost,
    deMinimisEligible,
    tradeAgreement: country.trade_agreement,
    countryNotes: country.notes,
  };
}
