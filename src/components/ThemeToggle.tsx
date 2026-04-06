import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function ThemeToggle() {
  const isDark = useAppStore((s) => s.isDarkMode);
  const toggle = useAppStore((s) => s.toggleDarkMode);

  return (
    <TouchableOpacity style={styles.button} onPress={toggle}>
      <Text style={styles.icon}>{isDark ? '☀️' : '🌙'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  icon: {
    fontSize: 22,
  },
});
