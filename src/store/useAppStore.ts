import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Country, Category, TariffResult } from '../types';

interface AppState {
  selectedCountry: Country | null;
  selectedCategory: Category | null;
  productValue: string;
  calculationResult: TariffResult | null;
  isDarkMode: boolean;

  setSelectedCountry: (country: Country) => void;
  setSelectedCategory: (category: Category) => void;
  setProductValue: (value: string) => void;
  setCalculationResult: (result: TariffResult | null) => void;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  loadThemePreference: () => Promise<void>;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedCountry: null,
  selectedCategory: null,
  productValue: '',
  calculationResult: null,
  isDarkMode: true,

  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setProductValue: (value) => set({ productValue: value }),
  setCalculationResult: (result) => set({ calculationResult: result }),

  toggleDarkMode: () => {
    const newValue = !get().isDarkMode;
    set({ isDarkMode: newValue });
    AsyncStorage.setItem('isDarkMode', JSON.stringify(newValue));
  },

  setDarkMode: (value) => {
    set({ isDarkMode: value });
    AsyncStorage.setItem('isDarkMode', JSON.stringify(value));
  },

  loadThemePreference: async () => {
    const stored = await AsyncStorage.getItem('isDarkMode');
    if (stored !== null) {
      set({ isDarkMode: JSON.parse(stored) });
    }
  },

  reset: () =>
    set({
      selectedCountry: null,
      selectedCategory: null,
      productValue: '',
      calculationResult: null,
    }),
}));
