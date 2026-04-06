import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/useAppStore';
import { colors, getThemeColors } from '../theme/colors';
import { formatCurrency, formatPercent } from '../utils/formatter';
import { shareResults } from '../utils/share';
import ResultCard from '../components/ResultCard';
import TariffBadge from '../components/TariffBadge';
import AnimatedNumber from '../components/AnimatedNumber';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;

export default function ResultsScreen() {
  const navigation = useNavigation<NavProp>();
  const isDark = useAppStore((s) => s.isDarkMode);
  const theme = getThemeColors(isDark);

  const result = useAppStore((s) => s.calculationResult);
  const country = useAppStore((s) => s.selectedCountry);
  const category = useAppStore((s) => s.selectedCategory);
  const reset = useAppStore((s) => s.reset);

  if (!result || !country || !category) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>No calculation result found.</Text>
      </View>
    );
  }

  const handleCalculateAnother = () => {
    reset();
    navigation.navigate('Calculator');
  };

  const handleShare = () => {
    shareResults(country.name, category.name, result);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Summary Card */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Product Value</Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>
            {formatCurrency(result.productValue)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Estimated Duty</Text>
          <AnimatedNumber
            value={result.totalDuty}
            prefix="$"
            style={[styles.totalDuty, { color: colors.severity.extreme }]}
          />
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Effective Tariff Rate</Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>
            {formatPercent(result.effectiveRate)}
          </Text>
        </View>

        <View style={[styles.summaryRow, styles.landedCostRow]}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Landed Cost</Text>
          <AnimatedNumber
            value={result.totalLandedCost}
            prefix="$"
            style={[styles.landedCost, { color: colors.primary }]}
          />
        </View>
      </View>

      {/* Breakdown Card */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Duty Breakdown</Text>

        {result.baseDutyRate > 0 && (
          <ResultCard label="Base MFN Duty" rate={result.baseDutyRate} amount={result.baseDuty} />
        )}

        {result.reciprocalRate > 0 && (
          <ResultCard
            label="Reciprocal Tariff (IEEPA)"
            rate={result.reciprocalRate}
            amount={result.reciprocalDuty}
          />
        )}

        {result.section301Duty > 0 && (
          <ResultCard
            label="Section 301 Tariff"
            rate={result.section301Rate}
            amount={result.section301Duty}
          />
        )}

        {result.section232Duty > 0 && (
          <ResultCard
            label="Section 232 Tariff"
            rate={result.section232Rate}
            amount={result.section232Duty}
          />
        )}

        <ResultCard label="Merchandise Processing Fee (MPF)" amount={result.mpf} />
        <ResultCard label="Harbor Maintenance Fee (HMF)" rate={0.125} amount={result.hmf} />

        <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total Duty</Text>
          <Text style={[styles.totalAmount, { color: theme.text }]}>
            {formatCurrency(result.totalDuty)}
          </Text>
        </View>
      </View>

      {/* Info Badges */}
      <View style={styles.badges}>
        <TariffBadge rate={result.effectiveRate} />

        {result.tradeAgreement && (
          <TariffBadge
            rate={0}
            label={`${result.tradeAgreement} Eligible — may qualify for 0% duty`}
          />
        )}

        {result.deMinimisEligible && (
          <TariffBadge
            rate={0}
            label="May qualify for duty-free entry under de minimis ($800)"
          />
        )}

        {country.code === 'CN' && result.productValue <= 800 && (
          <TariffBadge
            rate={100}
            label="De minimis exemption does NOT apply to China"
          />
        )}
      </View>

      {/* Country Notes */}
      {result.countryNotes ? (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Notes</Text>
          <Text style={[styles.notes, { color: theme.text }]}>{result.countryNotes}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleCalculateAnother}>
        <Text style={styles.primaryButtonText}>Calculate Another</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryButton, { borderColor: colors.primary }]}
        onPress={handleShare}
      >
        <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Share Results</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalDuty: {
    fontSize: 24,
    fontWeight: '800',
  },
  landedCostRow: {
    paddingTop: 12,
    marginTop: 4,
  },
  landedCost: {
    fontSize: 20,
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    marginTop: 4,
    borderTopWidth: 2,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
  badges: {
    marginBottom: 16,
    marginTop: 8,
  },
  notes: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
});
