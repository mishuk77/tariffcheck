import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/useAppStore';
import { colors } from './src/theme/colors';

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.dark.background,
    card: colors.dark.card,
    border: colors.dark.border,
    text: colors.dark.text,
    primary: colors.primary,
  },
};

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.light.background,
    card: colors.light.card,
    border: colors.light.border,
    text: colors.light.text,
    primary: colors.primary,
  },
};

export default function App() {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const loadThemePreference = useAppStore((s) => s.loadThemePreference);

  useEffect(() => {
    loadThemePreference();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={isDarkMode ? CustomDarkTheme : CustomLightTheme}>
        <AppNavigator />
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
