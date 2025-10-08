import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';
import i18n from '../i18n';
import StorageService from '../services/StorageService';

const LocaleContext = createContext(null);

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(i18n.getLocale());

  const changeLocale = async (newLocale) => {
    if (newLocale === locale) return;
    
    const needsRTLChange = (newLocale === 'ar') !== (locale === 'ar');
    
    i18n.setLocale(newLocale);
    await StorageService.storeLocale(newLocale);
    setLocale(newLocale);
    
    if (needsRTLChange) {
      I18nManager.forceRTL(newLocale === 'ar');
      // Reload app to apply RTL changes
      if (!__DEV__) {
        await Updates.reloadAsync();
      }
    }
  };

  useEffect(() => {
    // Load saved locale on mount
    StorageService.getLocale().then(savedLocale => {
      if (savedLocale && savedLocale !== locale) {
        i18n.setLocale(savedLocale);
        setLocale(savedLocale);
      }
    });
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, changeLocale, t: i18n.t, isRtl: i18n.isRtl }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
};

export default LocaleContext;
