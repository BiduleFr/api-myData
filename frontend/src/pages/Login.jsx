import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppearance } from '../context/AppearanceContext.jsx';
import AppearanceControls from '../components/AppearanceControls.jsx';
import { t } from '../lib/i18n.js';

export default function Login() {
  const { login } = useAuth();
  const { locale } = useAppearance();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const cleanId = identifier.trim();
    if (!cleanId) {
      setError(t(locale, 'Veuillez renseigner votre pseudo ou e-mail.'));
      return;
    }
    setLoading(true);
    try {
      await login(cleanId, password);
      navigate('/');
    } catch (err) {
      setError(locale === 'en' ? t(locale, 'Identifiant ou mot de passe incorrect.') : (err.message || t(locale, 'Identifiant ou mot de passe incorrect.')));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-8">
      <AppearanceControls />
      <div className="card w-full max-w-sm p-6 sm:p-8 animate-fade-up space-y-6">
        <div className="text-center">
          <span className="text-3xl">✨</span>
          <h1 className="text-2xl font-extrabold text-slate-800 mt-2">{t(locale, 'Bon retour')}</h1>
          <p className="text-sm text-slate-400 mt-1">{t(locale, 'Connectez-vous pour continuer votre suivi.')}</p>
        </div>
        <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col gap-4">
          <input
            type="text" required autoComplete="username" placeholder={t(locale, 'Pseudo ou e-mail')} value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <input
            type="password" required autoComplete="current-password" placeholder={t(locale, 'Mot de passe')} value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? t(locale, 'Connexion…') : t(locale, 'Se connecter')}
          </button>
        </form>
        <div className="text-center space-y-3 text-xs text-slate-400">
          <p className="text-sm">
            {t(locale, 'Pas encore de compte ?')}{' '}
            <Link to="/inscription" className="text-brand-600 font-semibold">{t(locale, 'Créer un compte')}</Link>
          </p>
          <p>
            <Link to="/conditions" className="hover:text-brand-600">{t(locale, "Conditions d'utilisation")}</Link>
            {' • '}
            <Link to="/confidentialite" className="hover:text-brand-600">{t(locale, 'Vie privée')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
