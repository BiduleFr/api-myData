import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import LineChart from '../components/LineChart.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api';

const RANGES = [
  { key: '7', label: '7 jours', days: 7 },
  { key: '30', label: '30 jours', days: 30 },
  { key: '90', label: '3 mois', days: 90 },
  { key: '365', label: '1 an', days: 365 }
];

export default function Stats() {
  const { token } = useAuth();
  const [modules, setModules] = useState([]);
  const [history, setHistory] = useState([]);
  const [range, setRange] = useState('30');
  const [metric, setMetric] = useState('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const days = RANGES.find((r) => r.key === range).days;
    const from = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    Promise.all([api.getConfig(), api.getHistory({ from }, token)])
      .then(([cfg, hist]) => {
        setModules(cfg.modules);
        setHistory(hist);
      })
      .finally(() => setLoading(false));
  }, [token, range]);

  const data = history.map((h) => ({
    date: h.date,
    value: metric === 'global' ? h.globalScore : h.moduleScores?.[metric] ?? null
  }));

  const average = (() => {
    const vals = data.map((d) => d.value).filter((v) => v !== null && v !== undefined);
    if (!vals.length) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  })();

  return (
    <Layout>
      <div className="space-y-6 animate-fade-up">
        <h1 className="text-2xl font-extrabold text-slate-800">Statistiques</h1>

        <div className="flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                range === r.key ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMetric('global')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${metric === 'global' ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            Score global
          </button>
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${metric === m.id ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              {m.icon} {m.name}
            </button>
          ))}
        </div>

        <div className="card p-6">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-sm text-slate-400">Moyenne sur la période</span>
            <span className="text-2xl font-extrabold text-brand-700">{average ?? '–'}</span>
          </div>
          {loading ? (
            <div className="text-center text-slate-400 py-10">Chargement…</div>
          ) : (
            <LineChart data={data} height={220} />
          )}
        </div>

        <p className="text-xs text-slate-400 text-center">
          Les tendances affichées sont indicatives et ne constituent pas un avis médical.
        </p>
      </div>
    </Layout>
  );
}
