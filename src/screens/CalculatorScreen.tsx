import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/useAppStore';
import { colors, getThemeColors } from '../theme/colors';
import { countries } from '../data';
import { calculateTariff } from '../utils/calculator';
import { parseInputValue } from '../utils/formatter';
import CountryPicker from '../components/CountryPicker';
import CategoryPicker from '../components/CategoryPicker';
import ValueInput from '../components/ValueInput';
import ThemeToggle from '../components/ThemeToggle';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Calculator'>;

export default function CalculatorScreen() {
  const navigation = useNavigation<NavProp>();
  const isDark = useAppStore((s) => s.isDarkMode);
  const theme = getThemeColors(isDark);

  const selectedCountry = useAppStore((s) => s.selectedCountry);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const productValue = useAppStore((s) => s.productValue);
  const setSelectedCountry = useAppStore((s) => s.setSelectedCountry);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);
  const setProductValue = useAppStore((s) => s.setProductValue);
  const setCalculationResult = useAppStore((s) => s.setCalculationResult);

  // Default to China on first load
  useEffect(() => {
    if (!selectedCountry) {
      const china = countries.find((c) => c.code === 'CN');
      if (china) setSelectedCountry(china);
    }
  }, []);

  const handleCalculate = () => {
    if (!selectedCountry) {
      Alert.alert('Missing Input', 'Please select a country of origin.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Missing Input', 'Please select a product category.');
      return;
    }
    const value = parseInputValue(productValue);
    if (value <= 0) {
      Alert.alert('Missing Input', 'Please enter a product value greater than $0.');
      return;
    }

    const result = calculateTariff(selectedCountry, selectedCategory, value);
    setCalculationResult(result);
    navigation.navigate('Results');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>TariffCheck</Text>
              <Text style={[styles.tagline, { color: theme.textSecondary }]}>
                Know what you'll pay before you import
              </Text>
            </View>
            <View style={styles.headerRight}>
              <ThemeToggle />
              <TouchableOpacity onPress={() => navigation.navigate('Info')} style={styles.infoButton}>
                <Text style={[styles.infoIcon, { color: colors.primary }]}>ℹ️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Country of Origin</Text>
            <CountryPicker selected={selectedCountry} onSelect={setSelectedCountry} />

            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 20 }]}>
              Product Category
            </Text>
            <CategoryPicker selected={selectedCategory} onSelect={setSelectedCategory} />

            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 20 }]}>
              Product Value (USD)
            </Text>
            <ValueInput value={productValue} onChangeText={setProductValue} />
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
            <Text style={styles.calculateButtonText}>Calculate Tariff</Text>
          </TouchableOpacity>

          {/* Disclaimer */}
          <Text style={[styles.disclaimer, { color: theme.textSecondary }]}>
            Estimates only. Actual duties may vary based on specific HTS classification.
            Consult a customs broker for binding determinations.
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  tagline: {
    fontSize: 15,
    marginTop: 4,
  },
  infoButton: {
    padding: 8,
  },
  infoIcon: {
    fontSize: 22,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
