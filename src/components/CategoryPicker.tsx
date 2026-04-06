import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Category } from '../types';
import { categories } from '../data';
import { useAppStore } from '../store/useAppStore';
import { colors, getThemeColors } from '../theme/colors';

interface Props {
  selected: Category | null;
  onSelect: (category: Category) => void;
}

export default function CategoryPicker({ selected, onSelect }: Props) {
  const [visible, setVisible] = useState(false);
  const isDark = useAppStore((s) => s.isDarkMode);
  const theme = getThemeColors(isDark);

  const handleSelect = (category: Category) => {
    onSelect(category);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.selectorText, { color: selected ? theme.text : theme.textSecondary }]}>
          {selected ? `${selected.icon} ${selected.name}` : 'Select Product Category'}
        </Text>
        <Text style={{ color: theme.textSecondary }}>▼</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Category</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={[styles.closeButton, { color: colors.primary }]}>Done</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  { borderBottomColor: theme.border },
                  selected?.id === item.id && { backgroundColor: isDark ? '#1E3A5F' : '#EBF5FF' },
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.icon}>{item.icon}</Text>
                <View style={styles.itemContent}>
                  <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.itemHint, { color: theme.textSecondary }]}>
                    Base MFN: {item.base_mfn_rate}%
                    {item.section_232_applies ? ' · Section 232 applies' : ''}
                  </Text>
                  <Text style={[styles.itemExamples, { color: theme.textSecondary }]} numberOfLines={1}>
                    {item.examples}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  icon: {
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
  itemHint: {
    fontSize: 13,
    marginTop: 2,
  },
  itemExamples: {
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
});
