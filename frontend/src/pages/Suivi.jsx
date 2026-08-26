import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import ObjectivesPanel from './suivi/ObjectivesPanel.jsx';
import HabitsPanel from './suivi/HabitsPanel.jsx';
import BehaviorsPanel from './suivi/BehaviorsPanel.jsx';

const TABS = [
  { id: 'objectifs', label: 'Objectifs', icon: '🎯' },
  { id: 'habitudes', label: 'Habitudes', icon: '🌱' },
  { id: 'comportements', label: 'Comportements', icon: '🛡️' }
];

export default function Suivi() {
  const [tab, setTab] = useState('objectifs');

  return (
    <Layout>
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Suivi</h1>
          <p className="text-sm text-slate-400 mt-1">Objectifs, habitudes positives et comportements à réduire.</p>
        </div>

        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                tab === t.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'objectifs' && <ObjectivesPanel />}
        {tab === 'habitudes' && <HabitsPanel />}
        {tab === 'comportements' && <BehaviorsPanel />}
      </div>
    </Layout>
  );
}
