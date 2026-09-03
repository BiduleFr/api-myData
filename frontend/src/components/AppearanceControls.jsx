import { useAppearance } from '../context/AppearanceContext.jsx';

export default function AppearanceControls() {
  const { locale, setLocale, theme, setTheme } = useAppearance();

  return (
    <div className="absolute right-4 top-4 flex items-center gap-1">
      <button type="button" onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')} className="btn-ghost px-2 text-xs" aria-label="Change language">{locale.toUpperCase()}</button>
      <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn-ghost px-2 text-sm" aria-label="Change theme">{theme === 'dark' ? '☀️' : '🌙'}</button>
    </div>
  );
}
