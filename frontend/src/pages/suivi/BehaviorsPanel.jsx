import { useEffect, useState } from 'react';
import { api, todayISO } from '../../lib/api';

const STATES = [
  { value: 'none', label: 'Aucune envie', icon: '😌' },
  { value: 'resisted', label: 'Résistance réussie', icon: '💪' },
  { value: 'acted', label: 'Réalisé', icon: '⚠️' }
];

function computeStreakWithoutActing(logs) {
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    const state = logs[key];
    if (state === undefined) break;
    if (state === 'acted') break;
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function BehaviorsPanel() {
  const [behaviors, setBehaviors] = useState([]);
  const [logs, setLogs] = useState({});
  const [title, setTitle] = useState('');
  const today = todayISO();

  useEffect(() => {
    Promise.all([api.getBehaviors(), api.getBehaviorLogs()]).then(([b, l]) => {
      setBehaviors(b || []);
      setLogs(l || {});
    });
  }, []);

  function addBehavior(e) {
    e.preventDefault();
    if (!title) return;
    const next = [...behaviors, { id: crypto.randomUUID(), title, active: true }];
    setBehaviors(next);
    api.saveBehaviors(next);
    setTitle('');
  }

  function removeBehavior(id) {
    const next = behaviors.filter((b) => b.id !== id);
    setBehaviors(next);
    api.saveBehaviors(next);
    const nextLogs = { ...logs };
    delete nextLogs[id];
    setLogs(nextLogs);
    api.saveBehaviorLogs(nextLogs);
  }

  function setToday(behaviorId, state) {
    const behaviorLogs = { ...(logs[behaviorId] || {}), [today]: state };
    const next = { ...logs, [behaviorId]: behaviorLogs };
    setLogs(next);
    api.saveBehaviorLogs(next);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addBehavior} className="card p-5 flex gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Comportement à surveiller (ex: Réseaux sociaux)"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
          required
        />
        <button type="submit" className="btn-primary">Ajouter</button>
      </form>

      <div className="space-y-3">
        {behaviors.length === 0 && <div className="text-sm text-slate-400">Aucun comportement suivi pour le moment.</div>}
        {behaviors.map((b) => {
          const behaviorLogs = logs[b.id] || {};
          const streak = computeStreakWithoutActing(behaviorLogs);
          const todayState = behaviorLogs[today];
          return (
            <div key={b.id} className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{b.title}</p>
                  {streak > 0 && <p className="text-xs text-emerald-600">🔥 {streak} jours sans</p>}
                </div>
                <button onClick={() => removeBehavior(b.id)} className="text-xs text-slate-400 hover:text-red-500">Suppr.</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {STATES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setToday(b.id, s.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      todayState === s.value ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 hover:border-brand-300'
                    }`}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
