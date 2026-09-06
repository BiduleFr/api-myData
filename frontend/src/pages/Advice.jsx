import Layout from '../components/Layout.jsx';
import { useAppearance } from '../context/AppearanceContext.jsx';
import { t } from '../lib/i18n.js';

export default function Advice() {
  const { locale } = useAppearance();
  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-5 animate-fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{t(locale, 'Conseils')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t(locale, 'Des pistes personnalisées pour comprendre vos tendances et avancer à votre rythme.')}</p>
        </div>
        <div className="card p-10 text-center">
          <span className="text-3xl">💡</span>
          <p className="mt-3 text-sm font-semibold text-slate-500">{locale === 'en' ? 'Coming soon.' : 'À venir bientôt.'}</p>
        </div>
      </div>
    </Layout>
  );
}