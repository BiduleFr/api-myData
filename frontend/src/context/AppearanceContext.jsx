import { createContext, useContext, useEffect, useState } from 'react';

const AppearanceContext = createContext(null);

export function AppearanceProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('elan_theme') || 'light');
  const [locale, setLocale] = useState(() => localStorage.getItem('elan_locale') || 'fr');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('elan_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem('elan_locale', locale);
  }, [locale]);

  return <AppearanceContext.Provider value={{ theme, setTheme, locale, setLocale }}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error('useAppearance doit être utilisé dans AppearanceProvider');
  return context;
}
