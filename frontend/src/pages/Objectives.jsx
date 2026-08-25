import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api';

function startOfPeriod(period) {
  const d = new Date();
  if (period === 'week') {
    const day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
  } else {
    d.setDate(1);
  }
  return d.toISOString().slice(0, 10);
}

function evaluateProgress(goal, entries) {
  const values = entries
    .map((e) => e.answers?.[goal.metricKey])
    .filter((v) => v !== undefined && v !== null && v !== '');

  if (!values.length) return { value: 0, done: false };

  let value = 0;
  if (goal.aggregation === 'count') value = values.length;
  else if (goal.aggregation === 'sum') value = values.reduce((a, b) => a + Number(b || 0), 0);
  else value = values.reduce((a, b) => a + Number(b || 0), 0) / values.length;

  const target = Number(goal.target || 0);
  let done = false;
  if (goal.direction === 'atMost') done = value <= target;
  else if (goal.direction === 'exact') done = value === target;
  else done = value >= target;

  return { value: Math.round(value * 100) / 100, done };
}

export default function Objectives() {
  const { token } = useAuth();
  const [modules, setModules] = useState([]);
  const [history, setHistory] = useState([]);
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: '',
    metricKey: '',
    direction: 'atLeast',
    target: 5,
    period: 'week',
    aggregation: 'average'
  });

  useEffect(() => {
    Promise.all([api.getConfig(), api.getGoals(token), api.getHistory({}, token)]).then(([cfg, gs, hist]) => {
      setModules(cfg.modules || []);
      setGoals(gs || []);
      setHistory(hist || []);
      if (!form.metricKey) {
        const first = (cfg.modules || []).flatMap((m) => m.questions || []).find((q) => ['scale', 'slider', 'number'].includes(q.type));
        if (first) setForm((prev) => ({ ...prev, metricKey: first.id }));
      }
    });
  }, [token]);

  const metricOptions = useMemo(() => {
    return modules.flatMap((m) =>
      (m.questions || [])
        .filter((q) => ['scale', 'slider', 'number'].includes(q.type))
        .map((q) => ({ value: q.id, label: `${m.name} · ${q.label}` }))
    );
  }, [modules]);

  function addGoal(e) {
    e.preventDefault();
    if (!form.title || !form.metricKey) return;
    const next = [...goals, { ...form, id: crypto.randomUUID(), active: true }];
    setGoals(next);
    api.saveGoals(next, token);
    setForm((prev) => ({ ...prev, title: '' }));
  }

  function removeGoal(id) {
    const next = goals.filter((g) => g.id !== id);
    setGoals(next);
    api.saveGoals(next, token);
  }

  const goalsWithProgress = goals.map((goal) => {
    const from = startOfPeriod(goal.period);
    const entries = history.filter((e) => e.date >= from);
    const progress = evaluateProgress(goal, entries);
    return { goal, progress };
  });

  return (
    <Layout>
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Objectifs</h1>
          <p className="text-sm text-slate-400 mt-1">Creez des objectifs relies a vos donnees quotidiennes.</p>
        </div>

        <form onSubmit={addGoal} className="card p-5 grid sm:grid-cols-2 gap-3">
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Nom de l'objectif"
            className="rounded-xl border border-slate-200 px-3 py-2"
            required
          />
          <select
            value={form.metricKey}
            onChange={(e) => setForm((p) => ({ ...p, metricKey: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2"
            required
          >
            {metricOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={form.direction}
            onChange={(e) => setForm((p) => ({ ...p, direction: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="atLeast">Atteindre au moins</option>
            <option value="atMost">Rester sous</option>
            <option value="exact">Atteindre exactement</option>
          </select>
          <input
            type="number"
            value={form.target}
            onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2"
            required
          />
          <select
            value={form.period}
            onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="week">Semaine</option>
            <option value="month">Mois</option>
          </select>
          <select
            value={form.aggregation}
            onChange={(e) => setForm((p) => ({ ...p, aggregation: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="average">Moyenne</option>
            <option value="sum">Somme</option>
            <option value="count">Frequence</option>
          </select>
          <button type="submit" className="btn-primary sm:col-span-2">Ajouter l'objectif</button>
        </form>

        <div className="space-y-3">
          {goalsWithProgress.length === 0 && (
            <div className="text-sm text-slate-400">Aucun objectif pour le moment.</div>
          )}
          {goalsWithProgress.map(({ goal, progress }) => (
            <div key={goal.id} className="card p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-800">{goal.title}</p>
                <p className="text-xs text-slate-500">{goal.period === 'week' ? 'Hebdo' : 'Mensuel'} · cible {goal.direction === 'atLeast' ? '>=' : goal.direction === 'atMost' ? '<=' : '='} {goal.target}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${progress.done ? 'text-emerald-600' : 'text-brand-700'}`}>{progress.value}</p>
                <button onClick={() => removeGoal(goal.id)} className="text-xs text-slate-400 hover:text-red-500">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
