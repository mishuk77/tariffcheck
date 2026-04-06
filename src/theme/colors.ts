export const colors = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',

  dark: {
    background: '#0F172A',
    card: '#1E293B',
    border: '#334155',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    inputBackground: '#1E293B',
  },

  light: {
    background: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    textSecondary: '#64748B',
    inputBackground: '#FFFFFF',
  },

  severity: {
    low: '#22C55E',
    moderate: '#EAB308',
    high: '#F97316',
    extreme: '#EF4444',
  },

  white: '#FFFFFF',
  black: '#000000',
};

export type ThemeColors = typeof colors.dark;

export function getThemeColors(isDark: boolean): ThemeColors {
  return isDark ? colors.dark : colors.light;
}

export function getSeverityColor(rate: number): string {
  if (rate <= 10) return colors.severity.low;
  if (rate <= 25) return colors.severity.moderate;
  if (rate <= 50) return colors.severity.high;
  return colors.severity.extreme;
}
