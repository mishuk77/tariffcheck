import { Share } from 'react-native';
import { TariffResult } from '../types';
import { formatCurrency, formatPercent } from './formatter';

export function generateShareText(
  countryName: string,
  categoryName: string,
  result: TariffResult
): string {
  let text = `TariffCheck - US Import Duty Estimate\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `Country: ${countryName}\n`;
  text += `Product: ${categoryName}\n`;
  text += `Value: ${formatCurrency(result.productValue)}\n\n`;
  text += `BREAKDOWN:\n`;

  if (result.baseDutyRate > 0) {
    text += `• Base MFN Duty (${formatPercent(result.baseDutyRate)}): ${formatCurrency(result.baseDuty)}\n`;
  }
  if (result.reciprocalDuty > 0) {
    text += `• Reciprocal Tariff (${formatPercent(result.reciprocalRate)}): ${formatCurrency(result.reciprocalDuty)}\n`;
  }
  if (result.section301Duty > 0) {
    text += `• Section 301 (${formatPercent(result.section301Rate)}): ${formatCurrency(result.section301Duty)}\n`;
  }
  if (result.section232Duty > 0) {
    text += `• Section 232 (${formatPercent(result.section232Rate)}): ${formatCurrency(result.section232Duty)}\n`;
  }
  text += `• Processing Fee (MPF): ${formatCurrency(result.mpf)}\n`;
  text += `• Harbor Fee (HMF): ${formatCurrency(result.hmf)}\n\n`;
  text += `TOTAL DUTY: ${formatCurrency(result.totalDuty)}\n`;
  text += `Effective Rate: ${formatPercent(result.effectiveRate)}\n`;
  text += `Landed Cost: ${formatCurrency(result.totalLandedCost)}\n\n`;

  if (result.deMinimisEligible) {
    text += `Note: May qualify for duty-free entry under de minimis ($800 threshold)\n`;
  }
  if (result.tradeAgreement) {
    text += `Note: ${result.tradeAgreement} eligible — may qualify for reduced rates\n`;
  }

  text += `\nCalculated with TariffCheck app`;
  return text;
}

export async function shareResults(
  countryName: string,
  categoryName: string,
  result: TariffResult
): Promise<void> {
  const text = generateShareText(countryName, categoryName, result);
  await Share.share({ message: text });
}
