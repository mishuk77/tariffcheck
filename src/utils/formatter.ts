export function formatCurrency(value: number): string {
  return '$' + value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(value: number): string {
  if (value === Math.floor(value)) {
    return value + '%';
  }
  return value.toFixed(1) + '%';
}

export function parseInputValue(text: string): number {
  const cleaned = text.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
