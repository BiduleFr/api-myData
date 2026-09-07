import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import { useAppearance } from '../context/AppearanceContext.jsx';
import { t } from '../lib/i18n.js';
import HabitsPanel from './suivi/HabitsPanel.jsx';
import BehaviorsPanel from './suivi/BehaviorsPanel.jsx';

const TABS = [
  { id: 'habitudes', label: 'Habitudes', icon: '🌱' },
  { id: 'comportements', label: 'Comportements', icon: '🛡️' }
];

export default function Suivi() {
  const [tab, setTab] = useState('habitudes');
  const { locale } = useAppearance();

  return (
    <Layout>
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{t(locale, 'Suivi')}</h1>
          <p className="text-sm text-slate-400 mt-1">{t(locale, 'Objectifs, habitudes positives et comportements à réduire.')}</p>
        </div>

        <div className="flex gap-2">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                tab === tabItem.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              {tabItem.icon} {t(locale, tabItem.label)}
            </button>
          ))}
        </div>

        {tab === 'habitudes' && <HabitsPanel />}
        {tab === 'comportements' && <BehaviorsPanel />}
      </div>
    </Layout>
  );
}
