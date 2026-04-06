import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { getThemeColors, colors } from '../theme/colors';
import { lastUpdated } from '../data';

export default function InfoScreen() {
  const isDark = useAppStore((s) => s.isDarkMode);
  const theme = getThemeColors(isDark);

  const sections = [
    {
      title: 'MFN (Most Favored Nation) Duty',
      body: 'The base tariff rate applied to imports from all WTO member countries. These rates are set by the Harmonized Tariff Schedule (HTS) and vary by product type.',
    },
    {
      title: 'Reciprocal Tariff (IEEPA)',
      body: 'Additional tariffs imposed under the International Emergency Economic Powers Act. These vary by country and are applied on top of base MFN duties. USMCA-compliant goods from Mexico and Canada are generally exempt.',
    },
    {
      title: 'Section 301 Tariff',
      body: 'Tariffs on Chinese goods imposed under Section 301 of the Trade Act of 1974, ranging from 7.5% to 25% depending on the product category. These are layered on top of other tariffs.',
    },
    {
      title: 'Section 232 Tariff',
      body: 'National security tariffs on steel (25%), aluminum (25%), automobiles (25%), copper (50%), lumber (10%), and semiconductors (25%). Applied on top of all other tariffs regardless of country.',
    },
    {
      title: 'Merchandise Processing Fee (MPF)',
      body: 'A fee charged by U.S. Customs on most imports. For formal entries (value ≥$2,500): 0.3464% of value, with a minimum of $31.67 and maximum of $614.35. For informal entries (<$2,500): flat $5.00.',
    },
    {
      title: 'Harbor Maintenance Fee (HMF)',
      body: 'A 0.125% fee on the value of cargo arriving via ocean vessel, used to maintain U.S. ports and harbors.',
    },
    {
      title: 'De Minimis Threshold',
      body: 'Shipments valued at $800 or less may enter the U.S. duty-free under the de minimis exemption. Important: This exemption does NOT apply to imports from China.',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.heading, { color: theme.text }]}>Understanding US Tariffs</Text>

      {sections.map((section, i) => (
        <View
          key={i}
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>{section.title}</Text>
          <Text style={[styles.cardBody, { color: theme.textSecondary }]}>{section.body}</Text>
        </View>
      ))}

      {/* Links */}
      <TouchableOpacity
        style={[styles.linkCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => Linking.openURL('https://hts.usitc.gov/')}
      >
        <Text style={[styles.linkText, { color: colors.primary }]}>
          View Full HTSUS Database →
        </Text>
        <Text style={[styles.linkSubtext, { color: theme.textSecondary }]}>
          For specific HTS codes and binding duty rates
        </Text>
      </TouchableOpacity>

      {/* Disclaimer */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Disclaimer</Text>
        <Text style={[styles.cardBody, { color: theme.textSecondary }]}>
          TariffCheck provides estimates based on publicly available tariff schedules.
          Actual duties may vary based on specific HTS product classification, country of
          origin determinations, trade agreement eligibility, and current trade policy.
          This app is for informational purposes only. Consult a licensed customs broker
          for binding duty determinations. Tariff rates are subject to change by Executive
          Order or legislative action.
        </Text>
      </View>

      {/* Meta */}
      <View style={styles.meta}>
        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
          Tariff data last updated: {lastUpdated}
        </Text>
        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
          TariffCheck v1.0.0
        </Text>
      </View>
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
  heading: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  linkCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
  },
  linkSubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  meta: {
    alignItems: 'center',
    marginTop: 20,
    gap: 4,
  },
  metaText: {
    fontSize: 13,
  },
});
