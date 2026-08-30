import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import LineChart from '../components/LineChart.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, todayISO } from '../lib/api';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Bonne nuit';
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bel après-midi';
  return 'Bonsoir';
}

function lastNDates(n) {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

const STATUS_LABEL = {
  complete: 'Terminée',
  draft: 'En brouillon',
  not_started: 'Non commencée'
};

const STATUS_DOT = {
  complete: 'bg-emerald-500',
  draft: 'bg-amber-400',
  not_started: 'bg-slate-200'
};

export default function Dashboard() {
  const { user, token } = useAuth();
  const [config, setConfig] = useState(null);
  const [entry, setEntry] = useState(null);
  const [history, setHistory] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const date = todayISO();
    Promise.all([
      api.getConfig(),
      api.getEntry(date, token),
      api.getHistory({ limit: 14 }, token),
      api.getGoals(token)
    ])
      .then(([cfg, todayEntry, hist, gs]) => {
        setConfig(cfg.modules);
        setEntry(todayEntry);
        setHistory(hist);
        setGoals(gs || []);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse text-slate-400 text-center py-20">Chargement de votre journée…</div>
      </Layout>
    );
  }

  const isComplete = entry?.completionStatus === 'complete';
  const isDraft = entry?.completionStatus === 'draft';
  const moduleScores = entry?.moduleScores || {};

  return (
    <Layout>
      <div className="animate-fade-up space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{greeting()}, {user?.username} 👋</h1>
          <p className="text-slate-400 mt-1">
            {isComplete
              ? 'Votre journée est enregistrée. Belle continuation !'
              : isDraft
              ? 'Vous avez commencé votre bilan du jour. Envie de le terminer ?'
              : 'Comment s\u2019est passée votre journée ?'}
          </p>
        </div>

        <div className="card p-8 flex flex-col sm:flex-row items-center gap-8">
          <ScoreRing score={entry?.globalScore ?? null} />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-slate-400 mb-3">
              {entry?.globalScore != null
                ? 'Votre suivi du jour'
                : 'Aucune donnée pour aujourd\u2019hui pour le moment'}
            </p>
            <Link to="/questionnaire" className="btn-primary">
              {isComplete ? 'Modifier mon bilan' : isDraft ? 'Reprendre mon bilan' : 'Faire le point sur ma journée'}
            </Link>
          </div>
        </div>

        {Object.keys(moduleScores).length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-500 mb-3">Aperçu par domaine</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {config
                ?.filter((m) => moduleScores[m.id] !== undefined)
                .map((m) => (
                  <div key={m.id} className="card p-4 flex items-center gap-3">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="text-xs text-slate-400">{m.name}</p>
                      <p className="font-bold text-slate-800">{moduleScores[m.id]}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-500">Évolution récente</h2>
            <Link to="/statistiques" className="text-sm text-brand-600 font-semibold">Voir les statistiques →</Link>
          </div>
          <LineChart data={history.map((h) => ({ date: h.date, value: h.globalScore }))} height={140} />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-500">Historique des 7 derniers jours</h2>
          </div>
          <div className="space-y-2">
            {lastNDates(7).map((d) => {
              const e = history.find((h) => h.date === d);
              const status = e?.completionStatus || 'not_started';
              const isToday = d === todayISO();
              return (
                <Link
                  key={d}
                  to={`/questionnaire?date=${d}`}
                  className="flex items-center justify-between text-sm rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} />
                    {isToday ? "Aujourd'hui" : d}
                  </span>
                  <span className="flex items-center gap-3 text-xs text-slate-500">
                    {e?.globalScore != null ? (
                      <span className="font-bold text-slate-800 bg-brand-50 text-brand-700 px-2 py-0.5 rounded-lg">
                        {Number(e.globalScore).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}/100
                      </span>
                    ) : (
                      <span className="text-slate-400">Non renseigné</span>
                    )}
                    <span>{STATUS_LABEL[status]}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-500">Objectifs actifs</h2>
            <Link to="/suivi" className="text-sm text-brand-600 font-semibold">Gerer →</Link>
          </div>
          {goals.length === 0 ? (
            <p className="text-sm text-slate-400">Ajoutez votre premier objectif pour suivre vos progres.</p>
          ) : (
            <div className="space-y-2">
              {goals.slice(0, 3).map((g) => (
                <div key={g.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">🎯 {g.title}</span>
                  <span className="text-slate-400">{g.period === 'week' ? 'Hebdo' : 'Mensuel'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to="/personnaliser" className="btn-secondary">⚙️ Personnaliser mon suivi</Link>
        </div>
      </div>
    </Layout>
  );
}
