import { calculateTariff } from '../src/utils/calculator';
import { Country, Category } from '../src/types';

const china: Country = {
  code: 'CN',
  name: 'China',
  flag: '🇨🇳',
  import_rank: 1,
  reciprocal_tariff_rate: 20,
  section_301_applies: true,
  section_301_rate_range: [7.5, 25],
  de_minimis_eligible: false,
  trade_agreement: null,
  notes: '',
};

const mexico: Country = {
  code: 'MX',
  name: 'Mexico',
  flag: '🇲🇽',
  import_rank: 2,
  reciprocal_tariff_rate: 0,
  section_301_applies: false,
  section_301_rate_range: null,
  de_minimis_eligible: true,
  trade_agreement: 'USMCA',
  notes: '',
};

const canada: Country = {
  code: 'CA',
  name: 'Canada',
  flag: '🇨🇦',
  import_rank: 3,
  reciprocal_tariff_rate: 35,
  section_301_applies: false,
  section_301_rate_range: null,
  de_minimis_eligible: true,
  trade_agreement: 'USMCA',
  notes: '',
};

const japan: Country = {
  code: 'JP',
  name: 'Japan',
  flag: '🇯🇵',
  import_rank: 5,
  reciprocal_tariff_rate: 24,
  section_301_applies: false,
  section_301_rate_range: null,
  de_minimis_eligible: true,
  trade_agreement: null,
  notes: '',
};

const electronics: Category = {
  id: 'electronics',
  name: 'Electronics & Computers',
  icon: '💻',
  base_mfn_rate: 0,
  section_301_rate_china: 25,
  section_232_applies: false,
  examples: '',
};

const clothing: Category = {
  id: 'clothing',
  name: 'Clothing & Apparel',
  icon: '👕',
  base_mfn_rate: 12,
  section_301_rate_china: 7.5,
  section_232_applies: false,
  examples: '',
};

const steel: Category = {
  id: 'steel_metals',
  name: 'Steel & Metals',
  icon: '🔩',
  base_mfn_rate: 0,
  section_301_rate_china: 25,
  section_232_applies: true,
  section_232_rate: 25,
  examples: '',
};

describe('calculateTariff', () => {
  test('China + Electronics + $500: Section 301 stacks on reciprocal', () => {
    const result = calculateTariff(china, electronics, 500);
    expect(result.baseDuty).toBe(0); // 0% MFN
    expect(result.reciprocalDuty).toBe(100); // 20% of 500
    expect(result.section301Duty).toBe(125); // 25% of 500
    expect(result.section232Duty).toBe(0); // not applicable
    expect(result.mpf).toBe(5.0); // informal entry (<$2500)
    expect(result.hmf).toBeCloseTo(0.625, 2); // 0.125% of 500
    expect(result.totalDuty).toBeCloseTo(230.625, 2);
  });

  test('Mexico + Clothing + $1000: USMCA zeroes reciprocal', () => {
    const result = calculateTariff(mexico, clothing, 1000);
    expect(result.baseDuty).toBe(120); // 12% MFN
    expect(result.reciprocalDuty).toBe(0); // USMCA
    expect(result.reciprocalRate).toBe(0);
    expect(result.section301Duty).toBe(0); // not China
    expect(result.tradeAgreement).toBe('USMCA');
  });

  test('Canada + Steel + $5000: Section 232 applies even with USMCA', () => {
    const result = calculateTariff(canada, steel, 5000);
    expect(result.reciprocalDuty).toBe(0); // USMCA
    expect(result.section232Duty).toBe(1250); // 25% of 5000
    expect(result.section301Duty).toBe(0); // not China
    expect(result.tradeAgreement).toBe('USMCA');
  });

  test('De minimis: Japan + $500 is eligible', () => {
    const result = calculateTariff(japan, electronics, 500);
    expect(result.deMinimisEligible).toBe(true);
  });

  test('De minimis: China + $500 is NOT eligible', () => {
    const result = calculateTariff(china, electronics, 500);
    expect(result.deMinimisEligible).toBe(false);
  });

  test('De minimis: Japan + $1000 is NOT eligible (over $800)', () => {
    const result = calculateTariff(japan, electronics, 1000);
    expect(result.deMinimisEligible).toBe(false);
  });

  test('Formal MPF for $3000 value', () => {
    const result = calculateTariff(japan, electronics, 3000);
    // 0.3464% of 3000 = 10.392, below min of 31.67
    expect(result.mpf).toBe(31.67);
  });

  test('Formal MPF for $100000 value', () => {
    const result = calculateTariff(japan, electronics, 100000);
    // 0.3464% of 100000 = 346.40, within range
    expect(result.mpf).toBeCloseTo(346.40, 2);
  });

  test('Formal MPF hits max for very large values', () => {
    const result = calculateTariff(japan, electronics, 1000000);
    // 0.3464% of 1000000 = 3464, above max of 614.35
    expect(result.mpf).toBe(614.35);
  });

  test('Informal MPF for $100 value', () => {
    const result = calculateTariff(japan, electronics, 100);
    expect(result.mpf).toBe(5.0);
  });

  test('Effective rate and landed cost are correct', () => {
    const result = calculateTariff(china, electronics, 1000);
    expect(result.totalLandedCost).toBe(result.productValue + result.totalDuty);
    expect(result.effectiveRate).toBeCloseTo(
      (result.totalDuty / result.productValue) * 100,
      2
    );
  });

  test('Zero value returns zero duties', () => {
    const result = calculateTariff(china, electronics, 0);
    expect(result.totalDuty).toBe(5.0); // only informal MPF
    expect(result.effectiveRate).toBe(0);
  });
});
