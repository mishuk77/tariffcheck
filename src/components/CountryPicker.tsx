import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Country } from '../types';
import { countries } from '../data';
import { useAppStore } from '../store/useAppStore';
import { colors, getThemeColors } from '../theme/colors';

interface Props {
  selected: Country | null;
  onSelect: (country: Country) => void;
}

export default function CountryPicker({ selected, onSelect }: Props) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const isDark = useAppStore((s) => s.isDarkMode);
  const theme = getThemeColors(isDark);

  const filtered = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelect = (country: Country) => {
    onSelect(country);
    setVisible(false);
    setSearch('');
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.selectorText, { color: selected ? theme.text : theme.textSecondary }]}>
          {selected ? `${selected.flag} ${selected.name}` : 'Select Country of Origin'}
        </Text>
        <Text style={{ color: theme.textSecondary }}>▼</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide">
        <KeyboardAvoidingView
          style={[styles.modal, { backgroundColor: theme.background }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Country</Text>
            <TouchableOpacity onPress={() => { setVisible(false); setSearch(''); }}>
              <Text style={[styles.closeButton, { color: colors.primary }]}>Done</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.searchInput, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
            placeholder="Search countries..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  { borderBottomColor: theme.border },
                  selected?.code === item.code && { backgroundColor: isDark ? '#1E3A5F' : '#EBF5FF' },
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={[styles.flag]}>{item.flag}</Text>
                <View style={styles.itemContent}>
                  <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.itemRate, { color: theme.textSecondary }]}>
                    {item.reciprocal_tariff_rate}% reciprocal
                    {item.trade_agreement ? ` · ${item.trade_agreement}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectorText: {
    fontSize: 16,
  },
  modal: {
    flex: 1,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 17,
    fontWeight: '600',
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  flag: {
    fontSize: 28,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemRate: {
    fontSize: 13,
    marginTop: 2,
  },
});
