import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LocaleProvider, useLocale } from '../src/i18n/LocaleContext';
import { t } from '../src/i18n';

const LanguageToggleButton: React.FC = () => {
  const { locale, setLocale } = useLocale();
  const next = locale === 'en' ? 'es' : 'en';
  return (
    <TouchableOpacity
      onPress={() => setLocale(next)}
      style={{ marginRight: 12 }}
      accessibilityRole="button"
      accessibilityLabel={`Switch language to ${next}`}
    >
      <Text style={{ color: '#fff', fontWeight: '600' }}>{next.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

const Screens: React.FC = () => {
  // consume locale so this component re-renders when locale changes
  const { locale } = useLocale();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t('app.title') || 'Countries Explorer',
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => <LanguageToggleButton />,
        }}
      />
      <Stack.Screen
        name="country/[id]"
        options={{
          title: t('app.countryDetails') || 'Country Details',
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => <LanguageToggleButton />,
        }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <LocaleProvider>
      <SafeAreaProvider>
        <Screens />
      </SafeAreaProvider>
    </LocaleProvider>
  );
}