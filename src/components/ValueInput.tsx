import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { getThemeColors } from '../theme/colors';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export default function ValueInput({ value, onChangeText }: Props) {
  const isDark = useAppStore((s) => s.isDarkMode);
  const theme = getThemeColors(isDark);

  const handleChange = (text: string) => {
    // Normalize: allow digits, one decimal point, replace commas
    const normalized = text.replace(/,/g, '.');
    const cleaned = normalized.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    const result = parts.length > 2
      ? parts[0] + '.' + parts.slice(1).join('')
      : cleaned;
    onChangeText(result);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
      <Text style={[styles.prefix, { color: theme.textSecondary }]}>$</Text>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={handleChange}
        keyboardType="decimal-pad"
        placeholder="e.g. 500.00"
        placeholderTextColor={theme.textSecondary}
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  prefix: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
  },
});
