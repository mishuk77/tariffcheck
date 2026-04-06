import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';
import CalculatorScreen from '../screens/CalculatorScreen';
import ResultsScreen from '../screens/ResultsScreen';
import InfoScreen from '../screens/InfoScreen';

export type RootStackParamList = {
  Calculator: undefined;
  Results: undefined;
  Info: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  return (
    <Stack.Navigator
      initialRouteName="Calculator"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode
            ? colors.dark.background
            : colors.light.background,
        },
        headerTintColor: isDarkMode ? colors.dark.text : colors.light.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          title: 'Tariff Breakdown',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={{ title: 'About TariffCheck' }}
      />
    </Stack.Navigator>
  );
}
