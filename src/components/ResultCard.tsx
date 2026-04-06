import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { getThemeColors } from '../theme/colors';
import { formatCurrency, formatPercent } from '../utils/formatter';

interface Props {
  label: string;
  rate?: number;
  amount: number;
  highlight?: boolean;
}

export default function ResultCard({ label, rate, amount, highlight }: Props) {
  const isDark = useAppStore((s) => s.isDarkMode);
  const theme = getThemeColors(isDark);

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        {rate !== undefined && rate > 0 && (
          <Text style={[styles.rate, { color: theme.textSecondary }]}>
            {formatPercent(rate)}
          </Text>
        )}
      </View>
      <Text
        style={[
          styles.amount,
          { color: highlight ? '#22C55E' : theme.text },
          highlight && styles.highlightAmount,
        ]}
      >
        {formatCurrency(amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  rate: {
    fontSize: 13,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
  highlightAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
});
