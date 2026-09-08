import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppearance } from '../context/AppearanceContext.jsx';
import AppearanceControls from '../components/AppearanceControls.jsx';
import { t } from '../lib/i18n.js';

export default function Register() {
  const { register } = useAuth();
  const { locale } = useAppearance();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim();
    const cleanEmail = email.trim();

    if (!cleanUser) {
      setError(locale === 'en' ? 'Please choose a username.' : 'Veuillez choisir un pseudo.');
      return;
    }
    if (password.length < 8) {
      setError(locale === 'en' ? 'The password must be at least 8 characters long.' : 'Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }
    if (!acceptTerms) {
      setError(locale === 'en' ? 'Please accept the terms of use and the privacy policy.' : 'Veuillez accepter les conditions d\'utilisation et la politique de confidentialité.');
      return;
    }

    setLoading(true);
    try {
      await register(cleanUser, password, cleanEmail);
      navigate('/');
    } catch (err) {
      setError(err.message || (locale === 'en' ? 'Error while creating the account.' : 'Erreur lors de la création du compte.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-8">
      <AppearanceControls />
      <div className="card w-full max-w-md p-6 sm:p-8 animate-fade-up space-y-6">
        <div className="text-center">
          <span className="text-3xl">🌱</span>
          <h1 className="text-2xl font-extrabold text-slate-800 mt-2">{t(locale, 'Créer votre suivi')}</h1>
          <p className="text-sm text-slate-400 mt-1">{t(locale, 'Un pseudo et un mot de passe suffisent.')}</p>
        </div>

        <div className="bg-brand-50/70 border border-brand-100 rounded-2xl p-4 text-xs text-slate-700 space-y-1.5">
          <p className="font-bold text-brand-900 flex items-center gap-1.5">
            <span>🛡️</span> {locale === 'en' ? 'Your data stays under your control' : 'Vos données restent sous votre contrôle'}
          </p>
          <p className="text-slate-600">{locale === 'en' ? 'Just choose a username. Details are available in our privacy policy.' : 'Choisissez simplement un pseudo. Les détails sont disponibles dans notre politique de confidentialité.'}</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col gap-4">
          <div>
            <input
              type="text" required autoComplete="username" placeholder={t(locale, 'Choisissez un pseudo')} value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <input
            type="password" required minLength={8} autoComplete="new-password" placeholder={t(locale, 'Mot de passe (8 caractères min.)')} value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />

          <div>
            <input
              type="email" autoComplete="email" placeholder={t(locale, 'Adresse e-mail (facultatif)')} value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <p className="text-xs text-slate-400 mt-2">{locale === 'en' ? 'Optional: useful to recover access to your account.' : "Facultatif : utile pour récupérer l'accès au compte."}</p>
          </div>

          <label className="flex items-start gap-2.5 text-xs text-slate-600 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 accent-brand-600 rounded"
              required
            />
            <span>
              {locale === 'en' ? 'I have read and accept the ' : "J'ai lu et j'accepte les "}
              <Link to="/conditions" target="_blank" className="text-brand-600 font-semibold underline">
                {locale === 'en' ? 'Terms of Use' : "Conditions Générales d'Utilisation"}
              </Link>{' '}
              {locale === 'en' ? 'and the ' : 'et la '}
              <Link to="/confidentialite" target="_blank" className="text-brand-600 font-semibold underline">
                {locale === 'en' ? 'Privacy Policy' : 'Politique de Confidentialité'}
              </Link>.
            </span>
          </label>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? t(locale, 'Création…') : t(locale, 'Créer mon compte')}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          {t(locale, 'Déjà un compte ?')}{' '}
          <Link to="/connexion" className="text-brand-600 font-semibold">{t(locale, 'Se connecter')}</Link>
        </p>
      </div>
    </div>
  );
}
