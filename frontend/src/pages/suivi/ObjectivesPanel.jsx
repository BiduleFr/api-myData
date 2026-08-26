import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../lib/api';

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

function countDaysInPeriod(period) {
  const from = new Date(startOfPeriod(period));
  const now = new Date();
  return Math.max(1, Math.round((now - from) / 86400000) + 1);
}

function evaluateMetricProgress(goal, entries) {
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

function evaluateHabitProgress(goal, habitLogs) {
  const from = startOfPeriod(goal.period);
  const logs = habitLogs[goal.habitId] || {};
  const totalDays = countDaysInPeriod(goal.period);
  const doneDays = Object.keys(logs).filter((d) => d >= from && logs[d]).length;
  const rate = Math.round((doneDays / totalDays) * 100);
  return { value: rate, done: rate >= Number(goal.target || 100) };
}

export default function ObjectivesPanel() {
  const { token } = useAuth();
  const [modules, setModules] = useState([]);
  const [history, setHistory] = useState([]);
  const [habits, setHabits] = useState([]);
  const [habitLogs, setHabitLogs] = useState({});
  const [goals, setGoals] = useState([]);
  const [sourceType, setSourceType] = useState('metric');
  const [form, setForm] = useState({
    title: '',
    metricKey: '',
    habitId: '',
    direction: 'atLeast',
    target: 5,
    period: 'week',
    aggregation: 'average'
  });

  useEffect(() => {
    Promise.all([api.getConfig(), api.getGoals(token), api.getHistory({}, token), api.getHabits(), api.getHabitLogs()])
      .then(([cfg, gs, hist, hb, hl]) => {
        setModules(cfg.modules || []);
        setGoals(gs || []);
        setHistory(hist || []);
        setHabits(hb || []);
        setHabitLogs(hl || {});
        if (!form.metricKey) {
          const first = (cfg.modules || []).flatMap((m) => m.questions || []).find((q) => ['scale', 'slider', 'number', 'quickstep'].includes(q.type));
          if (first) setForm((prev) => ({ ...prev, metricKey: first.id }));
        }
      });
  }, [token]);

  const metricOptions = useMemo(() => {
    return modules.flatMap((m) =>
      (m.questions || [])
        .filter((q) => ['scale', 'slider', 'number', 'quickstep'].includes(q.type))
        .map((q) => ({ value: q.id, label: `${m.name} · ${q.label}` }))
    );
  }, [modules]);

  function addGoal(e) {
    e.preventDefault();
    if (!form.title) return;
    if (sourceType === 'metric' && !form.metricKey) return;
    if (sourceType === 'habit' && !form.habitId) return;

    const goal = {
      id: crypto.randomUUID(),
      title: form.title,
      period: form.period,
      target: form.target,
      active: true,
      source: sourceType,
      ...(sourceType === 'metric'
        ? { metricKey: form.metricKey, direction: form.direction, aggregation: form.aggregation }
        : { habitId: form.habitId })
    };

    const next = [...goals, goal];
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
    if (goal.source === 'habit') {
      return { goal, progress: evaluateHabitProgress(goal, habitLogs), habit: habits.find((h) => h.id === goal.habitId) };
    }
    const from = startOfPeriod(goal.period);
    const entries = history.filter((e) => e.date >= from);
    return { goal, progress: evaluateMetricProgress(goal, entries) };
  });

  return (
    <div className="space-y-6">
      <form onSubmit={addGoal} className="card p-5 grid sm:grid-cols-2 gap-3">
        <input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Nom de l'objectif"
          className="rounded-xl border border-slate-200 px-3 py-2 sm:col-span-2"
          required
        />

        <div className="flex gap-2 sm:col-span-2">
          <button type="button" onClick={() => setSourceType('metric')} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${sourceType === 'metric' ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:bg-slate-100'}`}>Donnée du questionnaire</button>
          <button type="button" onClick={() => setSourceType('habit')} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${sourceType === 'habit' ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:bg-slate-100'}`}>Habitude suivie</button>
        </div>

        {sourceType === 'metric' ? (
          <>
            <select value={form.metricKey} onChange={(e) => setForm((p) => ({ ...p, metricKey: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2" required>
              {metricOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            <select value={form.direction} onChange={(e) => setForm((p) => ({ ...p, direction: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2">
              <option value="atLeast">Atteindre au moins</option>
              <option value="atMost">Rester sous</option>
              <option value="exact">Atteindre exactement</option>
            </select>
            <select value={form.aggregation} onChange={(e) => setForm((p) => ({ ...p, aggregation: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2">
              <option value="average">Moyenne</option>
              <option value="sum">Somme</option>
              <option value="count">Fréquence</option>
            </select>
          </>
        ) : (
          <select value={form.habitId} onChange={(e) => setForm((p) => ({ ...p, habitId: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2" required>
            <option value="">Choisir une habitude</option>
            {habits.map((h) => (<option key={h.id} value={h.id}>{h.title}</option>))}
          </select>
        )}

        <input type="number" value={form.target} onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))} placeholder={sourceType === 'habit' ? 'Cible % (ex: 80)' : 'Cible'} className="rounded-xl border border-slate-200 px-3 py-2" required />
        <select value={form.period} onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2">
          <option value="week">Semaine</option>
          <option value="month">Mois</option>
        </select>

        <button type="submit" className="btn-primary sm:col-span-2">Ajouter l'objectif</button>
      </form>

      <div className="space-y-3">
        {goalsWithProgress.length === 0 && <div className="text-sm text-slate-400">Aucun objectif pour le moment.</div>}
        {goalsWithProgress.map(({ goal, progress, habit }) => (
          <div key={goal.id} className="card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-800">{goal.title}</p>
              <p className="text-xs text-slate-500">
                {goal.period === 'week' ? 'Hebdo' : 'Mensuel'} ·{' '}
                {goal.source === 'habit'
                  ? `${habit?.title || 'habitude'} · cible ${goal.target}%`
                  : `cible ${goal.direction === 'atLeast' ? '≥' : goal.direction === 'atMost' ? '≤' : '='} ${goal.target}`}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-bold ${progress.done ? 'text-emerald-600' : 'text-brand-700'}`}>
                {progress.value}{goal.source === 'habit' ? '%' : ''}
              </p>
              <button onClick={() => removeGoal(goal.id)} className="text-xs text-slate-400 hover:text-red-500">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
