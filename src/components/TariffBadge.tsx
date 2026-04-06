import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getSeverityColor } from '../theme/colors';

interface Props {
  rate: number;
  label?: string;
}

export default function TariffBadge({ rate, label }: Props) {
  const color = getSeverityColor(rate);

  const severityLabel = rate <= 10 ? 'Low' : rate <= 25 ? 'Moderate' : rate <= 50 ? 'High' : 'Very High';

  return (
    <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>
        {label || `${severityLabel} Tariff (${rate.toFixed(1)}%)`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});
