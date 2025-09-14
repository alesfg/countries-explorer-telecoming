import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { setLocale as setLocaleHelper, t as translate } from './index';

const STORAGE_KEY = 'app_locale';

let AsyncStorage: any;
try {
  // optional dependency; if present we'll use it
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  AsyncStorage = null;
}

let Localization: any;
try {
  Localization = require('expo-localization');
} catch (e) {
  Localization = null;
}

type LocaleContextType = {
  locale: string;
  setLocale: (l: string) => Promise<void>;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  setLocale: async () => {},
});

export const useLocale = () => useContext(LocaleContext);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<string>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      // try to read persisted locale
      try {
        if (AsyncStorage) {
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            setLocaleState(stored);
            setLocaleHelper(stored);
            setReady(true);
            return;
          }
        }
      } catch (e) {
        // ignore
      }

      // fallback to device locale if possible
      try {
        const deviceLocale = Localization?.locale || Localization?.locales?.[0];
        if (deviceLocale && deviceLocale.startsWith('es')) {
          setLocaleState('es');
          setLocaleHelper('es');
        } else {
          setLocaleState('en');
          setLocaleHelper('en');
        }
      } catch (e) {
        setLocaleState('en');
        setLocaleHelper('en');
      }

      setReady(true);
    })();
  }, []);

  const setLocale = async (l: string) => {
    setLocaleState(l);
    setLocaleHelper(l);
    try {
      if (AsyncStorage) await AsyncStorage.setItem(STORAGE_KEY, l);
    } catch (e) {
      // ignore write errors
    }
  };

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useT = () => {
  return translate;
};
