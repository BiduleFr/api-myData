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
        <div className="card p-6 text-center">
          <p className="text-sm text-slate-500">{t(locale, 'Vos premiers conseils apparaîtront ici au fil de vos bilans.')}</p>
        </div>
      </div>
    </Layout>
  );
}